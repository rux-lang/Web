const expectedContent = new Map([
  ["/packages", "#recent-packages-heading"],
  ["/packages", "#catalog-results-heading"],
  ["/packages/-/search", "#catalog-results-heading"],
  ["/packages/rux/json", "#readme-heading"],
  ["/packages/-/dashboard", "#dashboard-content"],
]);

module.exports = async function preparePage(browser, { url, options }) {
  const page = await browser.newPage();
  try {
    await page.setViewport({ width: 320, height: 800, deviceScaleFactor: 1 });
    await page.goto(url, { waitUntil: "networkidle0" });
    const colorMode = options.settings?.preset === "desktop" ? "light" : "dark";
    await page.evaluate((mode) => localStorage.setItem("nuxt-color-mode", mode), colorMode);
    await page.reload({ waitUntil: "networkidle0" });

    const selector = expectedContent.get(new URL(url).pathname);
    if (!selector) throw new Error(`No quality sentinel is configured for ${url}`);
    try {
      await page.waitForSelector(selector, { timeout: 10000 });
    } catch (error) {
      const pageState = await page.evaluate(() => document.body.innerText.replace(/\s+/g, " ").trim().slice(0, 500));
      throw new Error(`Expected populated-state selector ${selector} for ${url}. Rendered page: ${pageState}`, {
        cause: error,
      });
    }

    const layout = await page.evaluate(
      (mode) => ({
        colorModeApplied: document.documentElement.classList.contains(mode),
        viewportWidth: document.documentElement.clientWidth,
        contentWidth: document.documentElement.scrollWidth,
      }),
      colorMode,
    );
    if (!layout.colorModeApplied) throw new Error(`${colorMode} color mode was not applied for ${url}`);
    if (layout.contentWidth > layout.viewportWidth) {
      throw new Error(`${url} overflows at 320 CSS pixels (${layout.contentWidth}px wide)`);
    }

    await page.keyboard.press("Tab");
    const skipLinkFocused = await page.evaluate(() => document.activeElement?.classList.contains("skip-link") === true);
    if (!skipLinkFocused) throw new Error(`The skip link was not the first keyboard target for ${url}`);
  } finally {
    await page.close();
  }
};
