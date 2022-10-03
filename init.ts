import { ensureFile, join, resolve } from "./src/deps.ts";

export async function createSitemap(url: string | null) {
  const routesDirectory = resolve("./routes");

  const destination = join(routesDirectory, "sitemap.xml.ts");

  await ensureFile(destination);

  const stub = `import { Handlers } from "$fresh/server.ts";
import manifest from "../fresh.gen.ts";
import { SitemapContext } from "https://deno.land/x/fresh_seo@0.1.1/mod.ts";
export const handler: Handlers = {
  GET(req, ctx) {
    const sitemap = new SitemapContext("${
    url ?? "http://exmaple.com"
  }", manifest);
    // You can add additional page here
    return sitemap.render();
  },
};
`;

  return Deno.writeTextFile(destination, stub);
}

export async function createRobotTxt(url: string | null) {
  const directory = resolve("./static");

  const destination = join(directory, "robots.txt");

  await ensureFile(destination);

  const stub = `User-agent: *
Allow: /
Disallow: /api/*
Sitemap: ${url ?? "http://example.com"}/sitemap.xml
`;

  return Deno.writeTextFile(destination, stub);
}

const url = prompt(
  "Please input your site's url (skip by enter):",
  "http://example.com",
);
await createSitemap(url);
await createRobotTxt(url);
