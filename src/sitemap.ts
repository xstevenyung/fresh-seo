import { basename, day, dirname, extname } from "./deps.ts";

export class SitemapContext {
  #url: string;
  #manifest: any;
  #globalIgnore = ["sitemap.xml"];

  constructor(url: string, manifest: any) {
    this.#url = url;
    this.#manifest = manifest;
  }

  generate() {
    return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
      ${
      Object.entries(this.#manifest.routes)
        .filter(([path]) => {
          const isRootRoute = "./routes" === dirname(path);
          const file = basename(path);
          const fileName = file.replace(extname(file), "");

          if (
            fileName.startsWith("_") || this.#globalIgnore.includes(fileName)
          ) {
            return false;
          }

          return true;
        })
        .map(([path, route]) => {
          const fileName = basename(path).replace(extname(path), "");
          const isDynamic = !!fileName.match(/^\[.+\]$/)?.length;

          path = path
            .replace(extname(path), "")
            .replace("./routes", this.#url)
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

  render() {
    return new Response(this.generate(), {
      headers: { "Content-Type": "application/xml" },
    });
  }

  // async save() {
  //   const outPath = join(this.#staticDir, "sitemap.xml");

  //   try {
  //     const content = this.generate();

  //     await ensureFile(outPath);

  //     return Deno.writeTextFile(outPath, content);
  //   } catch (e) {
  //     console.warn(e.message);
  //     return null;
  //   }
  // }
}

// const handler: Handlers = {
//   GET(req, ctx) {
//     return new Response();
//   },
// };
