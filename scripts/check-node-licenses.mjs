import { readFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";

function tokenize(expression) {
  const tokens = expression.match(/\(|\)|\bAND\b|\bOR\b|\bWITH\b|[A-Za-z0-9.+-]+/g) ?? [];
  const compact = expression.replace(/\s+/g, "");

  if (!tokens.length || tokens.join("") !== compact) {
    throw new Error(`unsupported SPDX expression: ${expression}`);
  }

  return tokens;
}

export function licenseExpressionIsAllowed(expression, allowedLicenses) {
  const tokens = tokenize(expression);
  let position = 0;

  function parseOr() {
    let value = parseAnd();
    while (tokens[position] === "OR") {
      position += 1;
      const right = parseAnd();
      value = value || right;
    }
    return value;
  }

  function parseAnd() {
    let value = parsePrimary();
    while (tokens[position] === "AND") {
      position += 1;
      const right = parsePrimary();
      value = value && right;
    }
    return value;
  }

  function parsePrimary() {
    if (tokens[position] === "(") {
      position += 1;
      const value = parseOr();
      if (tokens[position] !== ")") throw new Error(`unclosed SPDX expression: ${expression}`);
      position += 1;
      return value;
    }

    const identifier = tokens[position];
    if (!identifier || ["AND", "OR", "WITH", ")"].includes(identifier)) {
      throw new Error(`invalid SPDX expression: ${expression}`);
    }
    position += 1;

    if (tokens[position] === "WITH") {
      position += 1;
      const exception = tokens[position];
      if (!exception || ["AND", "OR", "WITH", "(", ")"].includes(exception)) {
        throw new Error(`invalid SPDX exception: ${expression}`);
      }
      position += 1;
      return allowedLicenses.has(`${identifier} WITH ${exception}`);
    }

    return allowedLicenses.has(identifier);
  }

  const allowed = parseOr();
  if (position !== tokens.length) throw new Error(`invalid SPDX expression: ${expression}`);
  return allowed;
}

function packageName(path, value) {
  if (value.name) return value.name;
  const suffix = path.split("node_modules/").at(-1);
  if (!suffix) return null;
  const parts = suffix.split("/");
  return suffix.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0];
}

export function evaluateNodeLicenses(lockfile, policy) {
  if (policy.schema_version !== 1) throw new Error("unsupported node license policy schema");
  if (!lockfile.packages || typeof lockfile.packages !== "object") {
    throw new Error("package lock does not contain a packages map");
  }

  const allowedLicenses = new Set(policy.allowed_licenses);
  const clarifications = new Map(policy.clarifications.map((value) => [`${value.name}@${value.version}`, value]));
  const failures = [];
  let checked = 0;

  for (const [path, value] of Object.entries(lockfile.packages)) {
    if (!path || !value.version || value.link) continue;
    const name = packageName(path, value);
    if (!name) continue;
    checked += 1;

    let expression = value.license;
    if (!expression) {
      const clarification = clarifications.get(`${name}@${value.version}`);
      if (!clarification) {
        failures.push(`${name}@${value.version}: missing license metadata`);
        continue;
      }
      if (!value.integrity || clarification.integrity !== value.integrity) {
        failures.push(`${name}@${value.version}: clarification integrity does not match the lockfile`);
        continue;
      }
      expression = clarification.license;
    }

    try {
      if (!licenseExpressionIsAllowed(expression, allowedLicenses)) {
        failures.push(`${name}@${value.version}: disallowed license expression ${expression}`);
      }
    } catch (error) {
      failures.push(`${name}@${value.version}: ${error.message}`);
    }
  }

  return { checked, failures };
}

export async function checkNodeLicenses(lockfilePath, policyPath) {
  const [lockfile, policy] = await Promise.all([
    readFile(lockfilePath, "utf8").then(JSON.parse),
    readFile(policyPath, "utf8").then(JSON.parse),
  ]);
  return evaluateNodeLicenses(lockfile, policy);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const lockfilePath = process.argv[2] ?? "package-lock.json";
  const policyPath = process.argv[3] ?? "supply-chain/node-license-policy.json";
  const result = await checkNodeLicenses(lockfilePath, policyPath);
  if (result.failures.length) {
    for (const failure of result.failures) console.error(`license policy violation: ${failure}`);
    process.exitCode = 1;
  } else {
    console.log(`Verified licenses for ${result.checked} npm package entries`);
  }
}
