# Fresh SEO 🍋

The fastest way ⚡️ to create sitemap in your Deno
[Fresh project](https://fresh.deno.dev/) project 🍋

## Getting started

To get started, run the init command at the root of your project

```bash
deno run --allow-read --allow-write https://deno.land/x/fresh_seo/init.ts
```

You should now have a new file `./routes/sitemap.xml.ts`;

You should now have a basic `sitemap.xml` available at
`http://localhost:8000/sitemap.xml`.

## How does it work?

Fresh SEO automatically map out **static** routes in your Fresh project so you
don't have to do anything for basic routes.

But you will still have to map dynamic routes yourself.

```diff
// ./routes/sitemap.xml.ts
import { Handlers } from "$fresh/server.ts";
import manifest from "../fresh.gen.ts";
import { SitemapContext } from "https://deno.land/x/fresh_seo/mod.ts";

export const handler: Handlers = {
  GET(req, ctx) {
    const sitemap = new SitemapContext(
      "http://example.com"
      manifest
    );

    // You can add additional page here
+   sitemap.add("/blog/hello-world");

    return sitemap.render();
  },
};
```

## Testing

You can run the test suite using `deno task test`.
