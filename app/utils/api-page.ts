const RUX_REPOSITORY = "https://github.com/rux-lang/Rux";
const PACKAGES_ROOT = "Packages";

const apiPackages = {
  bsd: "Bsd",
  c: "C",
  format: "Format",
  io: "Io",
  linux: "Linux",
  macos: "MacOS",
  math: "Math",
  memory: "Memory",
  rux: "Rux",
  text: "Text",
  windows: "Windows",
} as const;

type ApiPackageSlug = keyof typeof apiPackages;

// Every package currently documents Version = "0.1.0" in its Rux.toml.
// Keeping the value next to the source-routing table makes the badge easy to
// update when the package manifests advance independently of the compiler.
const packageVersions: Record<ApiPackageSlug, string> = {
  bsd: "0.1.0",
  c: "0.1.0",
  format: "0.1.0",
  io: "0.1.0",
  linux: "0.1.0",
  macos: "0.1.0",
  math: "0.1.0",
  memory: "0.1.0",
  rux: "0.1.0",
  text: "0.1.0",
  windows: "0.1.0",
};

const monolithicSources: Partial<Record<ApiPackageSlug, string>> = {
  bsd: "Bsd.rux",
  linux: "Linux.rux",
  macos: "MacOS.rux",
  windows: "Windows.rux",
};

const cMathMembers = new Set([
  "acos",
  "acosf",
  "acosh",
  "acoshf",
  "asin",
  "asinf",
  "asinh",
  "asinhf",
  "atan",
  "atan2",
  "atan2f",
  "atanf",
  "atanh",
  "atanhf",
  "cbrt",
  "cbrtf",
  "ceil",
  "ceilf",
  "copysign",
  "copysignf",
  "cos",
  "cosf",
  "cosh",
  "coshf",
  "erf",
  "erfc",
  "erfcf",
  "erff",
  "exp",
  "exp2",
  "exp2f",
  "expf",
  "expm1",
  "expm1f",
  "fabs",
  "fdim",
  "fdimf",
  "floor",
  "floorf",
  "fma",
  "fmaf",
  "fmax",
  "fmaxf",
  "fmin",
  "fminf",
  "fmod",
  "fmodf",
  "frexp",
  "hypot",
  "ilogb",
  "ilogbf",
  "ldexp",
  "lgamma",
  "lgammaf",
  "llrint",
  "llrintf",
  "llround",
  "llroundf",
  "log",
  "log10",
  "log10f",
  "log1p",
  "log1pf",
  "log2",
  "log2f",
  "logb",
  "logbf",
  "logf",
  "lrint",
  "lrintf",
  "lround",
  "lroundf",
  "modf",
  "modff",
  "nan",
  "nanf",
  "nearbyint",
  "nearbyintf",
  "nextafter",
  "nextafterf",
  "pow",
  "powf",
  "remainder",
  "remainderf",
  "remquo",
  "remquof",
  "rint",
  "rintf",
  "round",
  "roundf",
  "scalbn",
  "scalbnf",
  "sin",
  "sinf",
  "sinh",
  "sinhf",
  "sqrt",
  "sqrtf",
  "tan",
  "tanf",
  "tanh",
  "tanhf",
  "tgamma",
  "tgammaf",
  "trunc",
  "truncf",
]);

const cStdIoMembers = new Set([
  "clearerr",
  "fclose",
  "feof",
  "ferror",
  "fflush",
  "fgetc",
  "fgetpos",
  "fgets",
  "fopen",
  "fprintf",
  "fputc",
  "fputs",
  "fread",
  "freopen",
  "fscanf",
  "fseek",
  "fsetpos",
  "ftell",
  "fwrite",
  "getc",
  "getchar",
  "perror",
  "printf",
  "putc",
  "putchar",
  "puts",
  "remove",
  "rename",
  "rewind",
  "scanf",
  "setbuf",
  "setvbuf",
  "sprintf",
  "sscanf",
  "tmpfile",
  "tmpnam",
  "ungetc",
]);

const cStdLibMembers = new Set([
  "abort",
  "abs",
  "atof",
  "atoi",
  "atol",
  "atoll",
  "calloc",
  "exit",
  "free",
  "getenv",
  "labs",
  "llabs",
  "malloc",
  "rand",
  "realloc",
  "srand",
  "system",
]);

const cTimeMembers = new Set([
  "asctime",
  "clock",
  "ctime",
  "difftime",
  "gmtime",
  "localtime",
  "mktime",
  "strftime",
  "time",
]);

const formatSources: Record<string, string> = {
  parsefloat64: "ParseFloat64.rux",
  parseint64: "ParseInt64.rux",
  stringable: "Stringable.rux",
  tryparsefloat64: "ParseFloat64.rux",
  tryparseint64: "ParseInt64.rux",
  writebool: "Bool8.rux",
  writeint: "Digits.rux",
  writeuint: "Digits.rux",
};

const mathSources: Record<string, string> = {
  arccos: "ArcCos.rux",
  arccot: "ArcCot.rux",
  arcsin: "ArcSin.rux",
  arctan: "ArcTan.rux",
  degtorad: "Angle.rux",
  radtodeg: "Angle.rux",
};

const ioSources: Record<string, string> = {
  print: "Print.rux",
  printline: "PrintLine.rux",
  readline: "ReadLine.rux",
};

function titleCase(value: string): string {
  return value
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("");
}

function normalizedSegments(path: string): string[] {
  return path
    .replace(/\/+$/, "")
    .split("/")
    .filter(Boolean)
    .map((segment) => segment.toLowerCase());
}

function cSource(member: string): string | undefined {
  if (cMathMembers.has(member)) return "Math.rux";
  if (cStdIoMembers.has(member)) return "StdIo.rux";
  if (cStdLibMembers.has(member)) return "StdLib.rux";
  if (cTimeMembers.has(member)) return "Time.rux";
}

function sourceFile(packageSlug: ApiPackageSlug, segments: string[]): string | undefined {
  const member = segments.at(-1);
  if (!member || segments.length < 3) return undefined;

  if (monolithicSources[packageSlug]) return monolithicSources[packageSlug];
  if (packageSlug === "c") return cSource(member);
  if (packageSlug === "format") return formatSources[member];
  if (packageSlug === "io") return ioSources[member];
  if (packageSlug === "math") return mathSources[member] ?? `${titleCase(member)}.rux`;
  if (packageSlug === "memory" || packageSlug === "rux") return `${titleCase(member)}.rux`;

  if (packageSlug === "text") {
    if (segments.includes("stringbuilder")) return "StringBuilder.rux";
    if (segments.includes("string") || member === "isspace") return "String.rux";
  }
}

export interface ApiPageInfo {
  packageName?: string;
  sourceUrl: string;
  version?: string;
}

export function apiPageInfo(path: string): ApiPageInfo {
  const segments = normalizedSegments(path);
  const packageSlug = segments[0] === "api" ? (segments[1] as ApiPackageSlug | undefined) : undefined;

  if (!packageSlug || !(packageSlug in apiPackages)) {
    return { sourceUrl: `${RUX_REPOSITORY}/tree/main/${PACKAGES_ROOT}` };
  }

  const packageName = apiPackages[packageSlug];
  const packagePath = `${PACKAGES_ROOT}/${packageName}`;
  const file = sourceFile(packageSlug, segments);

  return {
    packageName,
    version: packageVersions[packageSlug],
    sourceUrl: file
      ? `${RUX_REPOSITORY}/blob/main/${packagePath}/Src/${file}`
      : `${RUX_REPOSITORY}/tree/main/${packagePath}`,
  };
}
