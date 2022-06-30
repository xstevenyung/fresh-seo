// import type { Manifest } from "fresh/server.ts";
import { createSitemap } from "../mod.ts";
import { assert, assertStringIncludes, FakeTime } from "./deps.ts";

Deno.env.set("APP_URL", "https://deno.land");

Deno.test("Empty sitemap", () => {
  const manifest = {
    routes: {},
  };

  const sitemap = createSitemap(manifest);

  assertStringIncludes(sitemap, '<?xml version="1.0" encoding="UTF-8"?>');
  assertStringIncludes(
    sitemap,
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">'
  );
  assertStringIncludes(sitemap, "</urlset>");
});

Deno.test("Map root index.ts", () => {
  const time = new FakeTime(new Date("2022-07-01"));
  const manifest = {
    routes: {
      "./routes/index.tsx": { default: () => null },
    },
  };

  const sitemap = createSitemap(manifest);

  try {
    assertStringIncludes(sitemap, '<?xml version="1.0" encoding="UTF-8"?>');
    assertStringIncludes(
      sitemap,
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">'
    );

    assertStringIncludes(sitemap, `<loc>https://deno.land/</loc>`);
    assertStringIncludes(sitemap, `<lastmod>2022-07-01</lastmod>`);
    assertStringIncludes(sitemap, `<changefreq>daily</changefreq>`);
    assertStringIncludes(sitemap, `<priority>0.8</priority>`);

    assertStringIncludes(sitemap, "</urlset>");
  } finally {
    time.restore();
  }
});

Deno.test("Map static route file", () => {
  const time = new FakeTime(new Date("2022-07-01"));
  const manifest = {
    routes: {
      "./routes/dashboard.tsx": { default: () => null },
    },
  };

  const sitemap = createSitemap(manifest);

  try {
    assertStringIncludes(sitemap, '<?xml version="1.0" encoding="UTF-8"?>');
    assertStringIncludes(
      sitemap,
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">'
    );

    assertStringIncludes(sitemap, `<loc>https://deno.land/dashboard</loc>`);
    assertStringIncludes(sitemap, `<lastmod>2022-07-01</lastmod>`);
    assertStringIncludes(sitemap, `<changefreq>daily</changefreq>`);
    assertStringIncludes(sitemap, `<priority>0.8</priority>`);

    assertStringIncludes(sitemap, "</urlset>");
  } finally {
    time.restore();
  }
});

Deno.test("Ignore 404 route file", () => {
  const manifest = {
    routes: {
      "./routes/_404.tsx": { default: () => null },
    },
  };

  const sitemap = createSitemap(manifest);

  assertStringIncludes(sitemap, '<?xml version="1.0" encoding="UTF-8"?>');
  assertStringIncludes(
    sitemap,
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">'
  );

  assert(!sitemap.includes(`<loc>https://deno.land/_404</loc>`));

  assertStringIncludes(sitemap, "</urlset>");
});
