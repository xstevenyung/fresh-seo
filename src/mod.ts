import { basename, day, dirname, ensureFile, extname, join } from "./deps.ts";

export const DEFAULT_OPTIONS = {
  staticDir: "./static",
};

export type Options = {
  staticDir: string;
  url: string;
};

export async function createSitemap(url: string, manifest: any) {
  const outPath = join(DEFAULT_OPTIONS.staticDir, "sitemap.xml");

  try {
    const sitemap = generateSitemap(url, manifest);

    await ensureFile(outPath);

    return Deno.writeTextFile(outPath, sitemap);
  } catch (e) {
    console.warn(e.message);
    return null;
  }
}

export function generateSitemap(url: string, manifest: any): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
      ${
    Object.entries(manifest.routes)
      .filter(([path]) => {
        const isRootRoute = "./routes" === dirname(path);
        const file = basename(path);
        const fileName = file.replace(extname(file), "");

        if (isRootRoute && fileName === "_404") {
          return false;
        }

        return true;
      })
      .map(([path, route]) => {
        const fileName = basename(path).replace(extname(path), "");
        const isDynamic = !!fileName.match(/^\[.+\]$/)?.length;

        path = path
          .replace(extname(path), "")
          .replace("./routes", url)
          .replace("index", ""); // We remove index as it's consider a "/" in Fresh

        if (isDynamic) {
          /** @ts-ignore */
          const routes = route.sitemap ? route.sitemap() : [];

          /** @ts-ignore */
          return routes.map((route) => {
            return `<url>
            <loc>${path.replace(fileName, route)}</loc>
            <lastmod>${day().format("YYYY-MM-DD")}</lastmod>
            <changefreq>daily</changefreq>
            <priority>0.8</priority>
          </url>`;
          });
        }

        return `<url>
          <loc>${path}</loc>
          <lastmod>${day().format("YYYY-MM-DD")}</lastmod>
          <changefreq>daily</changefreq>
          <priority>0.8</priority>
        </url>`;
      })
      .join("\n")
  }
    </urlset>`;
}
