import { Sitemap } from "../mod.ts";
import { assert, assertStringIncludes, FakeTime } from "./deps.ts";

const url = "https://deno.land";
Deno.env.set("APP_URL", url);

Deno.test("Empty sitemap", () => {
  const manifest = {
    routes: {},
  };
  const sitemap = new Sitemap(url, manifest);

  const result = sitemap.generate();

  assertStringIncludes(result, '<?xml version="1.0" encoding="UTF-8"?>');
  assertStringIncludes(
    result,
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  );
  assertStringIncludes(result, "</urlset>");
});

Deno.test("Map root index.ts", () => {
  const time = new FakeTime(new Date("2022-07-01"));
  const manifest = {
    routes: {
      "./routes/index.tsx": { default: () => null },
    },
  };
  const sitemap = new Sitemap(url, manifest);

  const result = sitemap.generate();

  try {
    assertStringIncludes(result, '<?xml version="1.0" encoding="UTF-8"?>');
    assertStringIncludes(
      result,
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    );

    assertStringIncludes(result, `<loc>https://deno.land/</loc>`);
    assertStringIncludes(result, `<lastmod>2022-07-01</lastmod>`);
    assertStringIncludes(result, `<changefreq>daily</changefreq>`);
    assertStringIncludes(result, `<priority>0.8</priority>`);

    assertStringIncludes(result, "</urlset>");
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
  const sitemap = new Sitemap(url, manifest);

  const result = sitemap.generate();

  try {
    assertStringIncludes(result, '<?xml version="1.0" encoding="UTF-8"?>');
    assertStringIncludes(
      result,
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    );

    assertStringIncludes(result, `<loc>https://deno.land/dashboard</loc>`);
    assertStringIncludes(result, `<lastmod>2022-07-01</lastmod>`);
    assertStringIncludes(result, `<changefreq>daily</changefreq>`);
    assertStringIncludes(result, `<priority>0.8</priority>`);

    assertStringIncludes(result, "</urlset>");
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
  const sitemap = new Sitemap(url, manifest);

  const result = sitemap.generate();

  assertStringIncludes(result, '<?xml version="1.0" encoding="UTF-8"?>');
  assertStringIncludes(
    result,
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
  );

  assert(!result.includes(`<loc>https://deno.land/_404</loc>`));

  assertStringIncludes(result, "</urlset>");
});

Deno.test("Create static/sitemap.xml file", async () => {
  try {
    await Deno.lstat("./tests/tmp/static/sitemap.xml");
    await Deno.remove("./tests/tmp", { recursive: true });
  } catch (e) {
    //
  }
  const manifest = {
    routes: {
      "./routes/dashboard.tsx": { default: () => null },
    },
  };
  const sitemap = new Sitemap(url, manifest);

  try {
    sitemap.save();

    const stat = await Deno.lstat("./tests/tmp/static/sitemap.xml");
    assert(stat.isFile);
  } finally {
    await Deno.remove("./tests/tmp", { recursive: true });
  }
});

Deno.test("Map dynamic routes", () => {
  const manifest = {
    routes: {
      "./routes/blog/[slug].tsx": {
        default: () => null,
        sitemap: () => {
          return [
            "my-awesome-blogpost",
          ];
        },
      },
    },
  };
  const sitemap = new Sitemap(url, manifest);

  const result = sitemap.generate();

  assert(!result.includes(`<loc>https://deno.land/blog/[slug]</loc>`));
  assertStringIncludes(
    result,
    "<loc>https://deno.land/blog/my-awesome-blogpost</loc>",
  );
});

Deno.test("Ignore dynamic routes if no sitemap function given", () => {
  const manifest = {
    routes: {
      "./routes/blog/[slug].tsx": {
        default: () => null,
      },
    },
  };
  const sitemap = new Sitemap(url, manifest);

  const result = sitemap.generate();

  assert(!result.includes(`<loc>https://deno.land/blog/[slug]</loc>`));
});
