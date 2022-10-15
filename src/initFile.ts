import { ensureFile, extname, join, resolve } from "./deps.ts";

function isUrl(input: string): boolean {
  try {
    new URL(input);
  } catch (_) {
    return false;
  }
  return true;
}

function isValidUrl(inputUrl: string): boolean {
  if (!isUrl(inputUrl.trim())) return false;
  return true;
}

function isValidDir(inputDir: string): boolean {
  if (inputDir.trim().length === 0) return false;
  return true;
}

async function createSitemap(url: string) {
  const routesDirectory = resolve("./routes");

  const destination = join(routesDirectory, "sitemap.xml.ts");

  await ensureFile(destination);

  const stub = `import { Handlers } from "$fresh/server.ts";
import manifest from "../fresh.gen.ts";
import { SitemapContext } from "https://deno.land/x/fresh_seo@0.2.1/mod.ts";
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

async function createRobotTxt(url: string, staticPath: string) {
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

async function createSeoConfig() {
  const routes: string[] = [];
  for await (const dirEntry of Deno.readDir("./routes")) {
    if (dirEntry.isFile) {
      const fileName = dirEntry.name.replace(extname(dirEntry.name), "");
      const isDynamic = !!fileName.match(/^\[.+\]$/)?.length;
      if (
        isDynamic ||
        fileName.startsWith("_") ||
        fileName.startsWith("sitemap")
      ) {
        continue;
      }
      routes.push(fileName);
    }
  }
  const routesText = routes.map((route) => {
    if (route === "index") {
      return `"/": {
      title: "index",
      description: "${route} page",
    }`;
    }
    return `
    "/${route}": {
      title: "${route}",
      description: "${route} page",
    }`;
  });
  const stub =
    `import { Config } from "https://deno.land/x/fresh_seo@0.2.1/mod.ts";
export default {
  routes: {
    ${routesText.join(",")}
  },
} as Config;
  `;
  return Deno.writeTextFile("./fresh-seo.config.ts", stub);
}

export async function init() {
  let url = prompt(
    "Please input your site's url (skip by enter):",
    "http://example.com",
  );

  if (!url || !isValidUrl(url)) {
    console.log(
      "Invalid url input! Setting to default value:'http://example.com'",
    );
    url = "http://example.com";
  }

  let staticPath = prompt(
    "Please input your site's static folder path (skip by enter):",
    "./static",
  );

  if (!staticPath || !isValidDir(staticPath)) {
    console.log("Invalid folder input! Setting to default value:'./static'");
    staticPath = "./static";
  }

  await createSitemap(url);

  await createRobotTxt(url, staticPath);
  await createSeoConfig();
}
