import { day, extname } from "./deps.ts";

export function createSitemap(manifest: any) {
  const baseURL = Deno.env.get("APP_URL");

  if (!baseURL) {
    throw new Error(
      "We are missing the APP_URL environment variable to generate the sitemap."
    );
  }

  return `
    <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
      ${Object.keys(manifest.routes).map((path) => {
        path = path.replace(extname(path), "");
        path = path.replace("index", "");

        return `<url>
          <loc>${path.replace("./routes", baseURL)}</loc>
          <lastmod>${day().format("YYYY-MM-DD")}</lastmod>
          <changefreq>daily</changefreq>
          <priority>0.8</priority>
        </url>`;
      })}
    </urlset>
  `;
}
