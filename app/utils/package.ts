import type { PackageSearchResult } from "~/types/catalog";
import type { PackageDependency } from "~/types/package";
import { normalizedIdentity } from "~/utils/catalog";

export function packageApiPath(namespace: string, packageName: string): string {
  return `/v1/packages/${encodeURIComponent(namespace)}/${encodeURIComponent(packageName)}`;
}

export function packageVersionApiPath(namespace: string, packageName: string, version: string): string {
  return `${packageApiPath(namespace, packageName)}/${encodeURIComponent(version)}`;
}

export function representativePackage(
  items: PackageSearchResult[],
  namespace: string,
  packageName: string,
): PackageSearchResult | null {
  const normalizedNamespace = normalizedIdentity(namespace);
  const normalizedPackage = normalizedIdentity(packageName);

  return (
    items.find(
      (item) =>
        normalizedIdentity(item.namespace) === normalizedNamespace &&
        normalizedIdentity(item.package) === normalizedPackage,
    ) ?? null
  );
}

export function exactInstallCommand(namespace: string, packageName: string, version: string): string {
  return `rux add ${namespace}/${packageName}@${version}`;
}

export function packageVersionTarget(
  namespace: string,
  packageName: string,
  version: string,
  representativeVersion: string,
) {
  const path = `/packages/${encodeURIComponent(normalizedIdentity(namespace))}/${encodeURIComponent(normalizedIdentity(packageName))}`;
  return version === representativeVersion ? { path } : { path, query: { version } };
}

export function dependencyPackagePath(dependency: PackageDependency): string {
  return `/packages/${encodeURIComponent(normalizedIdentity(dependency.target_namespace))}/${encodeURIComponent(normalizedIdentity(dependency.target_package))}`;
}

const byteFormatter = new Intl.NumberFormat("en", { maximumFractionDigits: 1 });

export function formatBytes(value: number): string {
  if (value < 1000) return `${value.toLocaleString("en")} B`;

  const units = ["kB", "MB", "GB", "TB"];
  let amount = value / 1000;
  let unit = units[0];
  for (let index = 1; index < units.length && amount >= 1000; index += 1) {
    amount /= 1000;
    unit = units[index];
  }

  return `${byteFormatter.format(amount)} ${unit}`;
}

export function normalizedManifestSource(value: Record<string, unknown>): string {
  return JSON.stringify(value, null, 2);
}
