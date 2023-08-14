import {
  fetchSitemapAsText,
  formatYearMonthDate,
  withFresh,
} from "./test_utils.ts";
import { assert, assertStringIncludes, assertThrows } from "./deps.ts";

Deno.test("sitemap generation works", async (t) => {
  await withFresh("./tests/fixture/dev.ts", async (address) => {
    const sitemap = await fetchSitemapAsText(`${address}/sitemap.xml`);
    const today = formatYearMonthDate(new Date());
    await t.step("should have sitemap.xml route", () => {
      assertStringIncludes(sitemap, '<?xml version="1.0" encoding="UTF-8"?>');
      assertStringIncludes(
        sitemap,
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">'
      );
    });

    await t.step("static routes should present", () => {
      // index route should present
      assertStringIncludes(sitemap, `<loc>${address}/</loc>`);
      assertStringIncludes(sitemap, `<lastmod>${today}</lastmod>`);
      assertStringIncludes(sitemap, `<changefreq>daily</changefreq>`);
      assertStringIncludes(sitemap, `<priority>0.8</priority>`);
      assertStringIncludes(sitemap, "</urlset>");

      // about route should present
      assertStringIncludes(sitemap, `<loc>${address}/about</loc>`);
      assertStringIncludes(sitemap, `<lastmod>${today}</lastmod>`);
      assertStringIncludes(sitemap, `<changefreq>daily</changefreq>`);
      assertStringIncludes(sitemap, `<priority>0.8</priority>`);
      assertStringIncludes(sitemap, "</urlset>");
    });

    await t.step("Special routes should not present", () => {
      assert(!sitemap.includes(`<loc>https://${address}/_404</loc>`));
      assert(!sitemap.includes(`<loc>https://${address}/_middleware</loc>`));
      assert(!sitemap.includes(`<loc>https://${address}/_500</loc>`));
    });

    await t.step("Dynamic routes should not present", () => {
      assert(!sitemap.includes(`<loc>https://${address}/greet/[name]</loc>`));
    });

    await t.step("sitemap.xml route should not present", () => {
      assert(!sitemap.includes(`<loc>https://${address}/sitemap.xml</loc>`));
    });
  });
});
