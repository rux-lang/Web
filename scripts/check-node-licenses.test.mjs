import assert from "node:assert/strict";
import test from "node:test";

import { evaluateNodeLicenses, licenseExpressionIsAllowed } from "./check-node-licenses.mjs";

const allowed = new Set(["MIT", "Apache-2.0", "Apache-2.0 WITH LLVM-exception"]);

test("SPDX alternatives pass when an allowed branch exists", () => {
  assert.equal(licenseExpressionIsAllowed("(GPL-2.0 OR MIT)", allowed), true);
});

test("SPDX conjunctions require every branch to be allowed", () => {
  assert.equal(licenseExpressionIsAllowed("MIT AND GPL-2.0", allowed), false);
});

test("SPDX exceptions are evaluated as an exact license pair", () => {
  assert.equal(licenseExpressionIsAllowed("Apache-2.0 WITH LLVM-exception", allowed), true);
  assert.equal(licenseExpressionIsAllowed("Apache-2.0 WITH Classpath-exception-2.0", allowed), false);
});

test("missing metadata requires an integrity-bound clarification", () => {
  const lockfile = {
    packages: {
      "": {},
      "node_modules/example": { version: "1.2.3", integrity: "sha512-example" },
    },
  };
  const policy = {
    schema_version: 1,
    allowed_licenses: ["MIT"],
    clarifications: [
      {
        name: "example",
        version: "1.2.3",
        integrity: "sha512-example",
        license: "MIT",
      },
    ],
  };

  assert.deepEqual(evaluateNodeLicenses(lockfile, policy), {
    checked: 1,
    failures: [],
  });
  lockfile.packages["node_modules/example"].integrity = "sha512-changed";
  assert.match(evaluateNodeLicenses(lockfile, policy).failures[0], /integrity/);
});

test("unknown and disallowed licenses fail with package identity", () => {
  const lockfile = {
    packages: {
      "node_modules/unknown": { version: "1.0.0" },
      "node_modules/copyleft": { version: "2.0.0", license: "GPL-3.0-only" },
    },
  };
  const policy = {
    schema_version: 1,
    allowed_licenses: ["MIT"],
    clarifications: [],
  };
  const result = evaluateNodeLicenses(lockfile, policy);

  assert.equal(result.failures.length, 2);
  assert.match(result.failures[0], /unknown@1\.0\.0/);
  assert.match(result.failures[1], /copyleft@2\.0\.0/);
});
