import { withFresh } from "./test_utils.ts";
import { assert, assertStringIncludes, assertThrows } from "./deps.ts";

Deno.test("/test plugin", async () => {
  await withFresh("./tests/fixture/main.ts", async (address) => {
    const resp = await fetch(`${address}/sitemap.xml`);
    const xml = await resp.text();
    console.log(xml);
    assertStringIncludes(xml, '<?xml version="1.0" encoding="UTF-8"?>');
    assertStringIncludes(
      xml,
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">'
    );
  });
});
