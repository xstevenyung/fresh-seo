import { join, resolve } from "https://deno.land/std@0.128.0/path/mod.ts";
import { ensureFile } from "https://deno.land/std@0.128.0/fs/mod.ts";

const scriptsDirectory = resolve("./scripts");

const destination = join(scriptsDirectory, "sitemap.ts");

await ensureFile(destination);

const stub = `import { createSitemap } from "https://deno.land/x/fresh_seo/mod.ts";
import manifest from "../fresh.gen.ts";

const [url] = Deno.args;

await createSitemap(url, manifest);`

await Deno.writeTextFile(destination, stub);
