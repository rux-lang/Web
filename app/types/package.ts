import type { PackageType } from "./catalog";

export type TargetOperatingSystem =
  "Windows" | "Linux" | "MacOS" | "FreeBSD" | "OpenBSD" | "NetBSD" | "DragonFlyBSD" | "Illumos";

export interface PackageSummary {
  namespace: string;
  package: string;
  created_at: string;
  canonical_url: string;
}

export interface PackageDependency {
  alias: string;
  target_namespace: string;
  target_package: string;
  version_range: string;
  target_os?: TargetOperatingSystem[];
}

export interface PackageTextFile {
  path: string;
  source: string;
}

export type PackageReadme = PackageTextFile;
export type PackageLicenseFile = PackageTextFile;

export interface PackageChecksum {
  algorithm: "sha256";
  digest: string;
}

export interface PackageVersion {
  namespace: string;
  package: string;
  version: string;
  manifest_schema_version: number;
  min_rux: string;
  package_type: PackageType;
  description: string | null;
  authors: string[];
  keywords: string[];
  repository_url: string | null;
  homepage_url: string | null;
  dependencies: PackageDependency[];
  normalized_manifest: Record<string, unknown>;
  readme_file: PackageReadme | null;
  license: string | null;
  license_file: PackageLicenseFile | null;
  checksum: PackageChecksum;
  artifact_size: number;
  artifact_file_count: number;
  artifact_expanded_bytes: number;
  source_file_count: number;
  source_line_count: number;
  published_at: string;
  yanked: boolean;
  package_url: string;
  canonical_url: string;
  download_url: string;
}

export interface PackageVersionHistory {
  version: string;
  min_rux: string;
  package_type: PackageType;
  published_at: string;
  yanked: boolean;
  canonical_url: string;
  download_url: string;
}

export interface PackageDownloadDay {
  date: string;
  downloads: number;
}

export interface PackageDownloadStatistics {
  window_days: number;
  start_date: string;
  end_date: string;
  total_downloads: number;
  total_all_time: number;
  daily: PackageDownloadDay[];
}

export interface DependentRequirement {
  alias: string;
  version_range: string;
  target_os?: TargetOperatingSystem[];
}

export interface DependentPackage {
  namespace: string;
  package: string;
  version: string;
  package_type: PackageType;
  description: string | null;
  published_at: string;
  yanked: boolean;
  requirements: DependentRequirement[];
  package_url: string;
  version_url: string;
}

export interface PackagePageDocument {
  summary: PackageSummary;
  release: PackageVersion | null;
  representative_version: string | null;
}
