/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />
/// <reference lib="deno.unstable" />

import day from "dayjs";
import { basename, extname } from "path";
import { Manifest } from "fresh/server.ts";

export class SitemapContext {
  #url: string;
  #manifest: Manifest;
  #globalIgnore = ["sitemap.xml"];
  #routes: Array<string> = [];

  constructor(url: string, manifest: Manifest) {
    this.#url = url;
    this.#manifest = manifest;
    this.#routes = Object.entries(this.#manifest.routes)
      .filter(([path]) => {
        // const isRootRoute = "./routes" === dirname(path);
        const file = basename(path);
        const fileName = file.replace(extname(file), "");
        const isDynamic = !!fileName.match(/^\[.+\]$/)?.length;

        if (
          isDynamic || fileName.startsWith("_") ||
          this.#globalIgnore.includes(fileName)
        ) {
          return false;
        }

        return true;
      })
      .map(([path, route]) => {
        return path
          .replace(extname(path), "")
          .replace("./routes", "")
          .replace("index", ""); // We remove index as it's consider a "/" in Fresh
      })
  }

  get routes() {
    return this.#routes;
  }

  add(route: string) {
    this.#routes.push(route);
    return this;
  }

  remove(route: string) {
    this.#routes = this.#routes.filter(r => r !== route);
    return this;
  }

  generate() {
    return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
      ${this.routes.map((route) => {
      return `<url>
          <loc>${this.#url}${route}</loc>
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
