const { Launcher } = require("chrome-launcher");

const qualityHost = process.env.RUX_QUALITY_HOST ?? "127.0.0.1";
const qualityPort = process.env.RUX_QUALITY_PORT ?? "4173";
const origin = `https://${qualityHost}:${qualityPort}`;
const urls = [
  `${origin}/`,
  `${origin}/packages`,
  `${origin}/packages?q=json`,
  `${origin}/packages/rux/json`,
  `${origin}/packages/-/dashboard`,
];

const requestedPath = process.env.RUX_QUALITY_PATH;
const selectedUrls = requestedPath ? urls.filter((value) => new URL(value).pathname === requestedPath) : urls;
const numberOfRuns = Number.parseInt(process.env.RUX_QUALITY_RUNS ?? "3", 10);

if (!selectedUrls.length) throw new Error(`Unknown RUX_QUALITY_PATH: ${requestedPath}`);
if (!Number.isInteger(numberOfRuns) || numberOfRuns < 1) {
  throw new Error("RUX_QUALITY_RUNS must be a positive integer");
}

const metricAssertions = {
  "categories:accessibility": ["error", { minScore: 1, aggregationMethod: "median" }],
  "categories:best-practices": ["error", { minScore: 0.95, aggregationMethod: "median" }],
  "largest-contentful-paint": ["error", { maxNumericValue: 2500, aggregationMethod: "median" }],
  "cumulative-layout-shift": ["error", { maxNumericValue: 0.1, aggregationMethod: "median" }],
  "total-blocking-time": ["error", { maxNumericValue: 200, aggregationMethod: "median" }],
  "total-byte-weight": ["error", { maxNumericValue: 409600, aggregationMethod: "median" }],
};

module.exports = function lighthouseConfig({ desktop, outputDir }) {
  const settings = desktop
    ? { preset: "desktop" }
    : {
        throttling: {
          rttMs: 40,
          throughputKbps: 10 * 1024,
          cpuSlowdownMultiplier: 4,
          requestLatencyMs: 0,
          downloadThroughputKbps: 0,
          uploadThroughputKbps: 0,
        },
      };

  return {
    ci: {
      collect: {
        chromePath: process.env.CHROME_PATH ?? Launcher.getFirstInstallation(),
        numberOfRuns,
        puppeteerLaunchOptions: {
          args: ["--no-sandbox", "--disable-setuid-sandbox", "--ignore-certificate-errors"],
        },
        puppeteerScript: "./test/lighthouse-prepare.cjs",
        url: selectedUrls,
        settings,
      },
      assert: {
        assertMatrix: [
          {
            matchingUrlPattern: ".*",
            assertions: {
              ...metricAssertions,
              "categories:performance": [
                "error",
                {
                  minScore: 0.9,
                  aggregationMethod: "median",
                },
              ],
            },
          },
          {
            matchingUrlPattern: "^(?!.*\\/(?:search|dashboard)(?:\\?|$)).*$",
            assertions: {
              "categories:seo": ["error", { minScore: 0.95, aggregationMethod: "median" }],
            },
          },
        ],
      },
      upload: {
        target: "filesystem",
        outputDir,
      },
    },
  };
};
