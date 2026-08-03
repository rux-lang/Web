const lighthouseConfig = require("./test/lighthouse-config.cjs");

module.exports = lighthouseConfig({
  desktop: false,
  outputDir: "./lighthouse-reports/mobile",
});
