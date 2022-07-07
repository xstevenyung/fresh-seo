import { join, resolve } from "https://deno.land/std@0.128.0/path/mod.ts";
import { ensureFile } from "https://deno.land/std@0.128.0/fs/mod.ts";

const routesDirectory = resolve("./routes");

const destination = join(routesDirectory, "sitemap.xml.ts");

await ensureFile(destination);

const stub = `import { Handlers } from "$fresh/server.ts";
import manifest from "../fresh.gen.ts";
import { SitemapContext } from "https://deno.land/x/fresh_seo@0.1.0/mod.ts";

export const handler: Handlers = {
  GET(req, ctx) {
    const sitemap = new SitemapContext("http://example.com", manifest);

    // You can add additional page here

    return sitemap.render();
  },
};
`;

await Deno.writeTextFile(destination, stub);
