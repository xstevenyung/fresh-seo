import { ensureFile, join, resolve } from "./deps.ts";

function isUrl(input: string): boolean {
  try {
    new URL(input);
  } catch (_) {
    return false;
  }
  return true;
}

function validateUrl(inputUrl: string | null): string {
  if (!inputUrl || !isUrl(inputUrl.trim())) return "http://example.com";
  return inputUrl;
}

function validateDir(inputDir: string | null): string {
  if (!inputDir || inputDir.trim().length === 0) return "./static";
  return inputDir;
}

async function createSitemap(url: string) {
  const routesDirectory = resolve("./routes");

  const destination = join(routesDirectory, "sitemap.xml.ts");
  
  await ensureFile(destination);

  const stub = `import { Handlers } from "$fresh/server.ts";
import manifest from "../fresh.gen.ts";
import { SitemapContext } from "https://deno.land/x/fresh_seo@0.1.1/mod.ts";
export const handler: Handlers = {
  GET(req, ctx) {
    const sitemap = new SitemapContext("${url}", manifest);
    // You can add additional page here
    return sitemap.render();
  },
};
`;

  return Deno.writeTextFile(destination, stub);
}

async function createRobotTxt(
  url: string,
  staticPath: string,
) {
  const directory = resolve(staticPath);

  const destination = join(directory, "robots.txt");

  await ensureFile(destination);

  const stub = `User-agent: *
Allow: /
Disallow: /api/*
Sitemap: ${url}/sitemap.xml
`;

  return Deno.writeTextFile(destination, stub);
}

export async function init() {
  const url = prompt(
    "Please input your site's url (skip by enter):",
    "http://example.com",
  );

  const staticPath = prompt(
    "Please input your site's static folder path (skip by enter):",
    "./static",
  );

  await createSitemap(validateUrl(url));
  await createRobotTxt(validateUrl(url), validateDir(staticPath));
}
