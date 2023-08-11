import { SitemapContext } from "./sitemap.ts";
import { Manifest, Plugin } from "./types.ts";

interface PluginOptions {
	include: string[];
	exclude: string[];
}

export const freshSEOPlugin = (manifest: Manifest, opts: PluginOptions = {}): Plugin => {
	return {
		name: "fresh-seo",
		routes: [
			{
				path: "/sitemap.xml",
				handler: (req) => {
					const sitemap = new SitemapContext(req.url, manifest);

					if (opts.include) {
						opts.include.forEach((path) => {
							sitemap.add(path);
						})
					}

					if (opts.exclude) {
						opts.exclude.forEach((path) => {
							sitemap.remove(path);
						})
					}


					return sitemap.render();
				}
			}
		]
	}
}
