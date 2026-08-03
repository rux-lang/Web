const lighthouseConfig = require("./test/lighthouse-config.cjs");

module.exports = lighthouseConfig({
  desktop: true,
  outputDir: "./lighthouse-reports/desktop",
});
