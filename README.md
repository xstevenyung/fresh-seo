
# Fresh SEO 🍋   [![Badge License]][License]

*Quickly creating sitemaps for your **Deno [Fresh project]**.*

<br>

## Getting Started

*Import the plugin `freshSEOPlugin` in your Fresh app*

```ts
import { start } from "$fresh/server.ts";
import manifest from "./fresh.gen.ts";

import { freshSEOPlugin } from "https://deno.land/x/fresh_seo/mod.ts";

await start(manifest, {
  plugins: [
    // This line configures Fresh to use the first-party twind plugin.
    freshSEOPlugin(manifest)
  ],
});

```

A basic sitemap should now be available at:
    
[`http://localhost:8000/sitemap.xml`][Localhost]
    
<br>
<br>

## How does it work?

**Fresh SEO 🍋** automatically maps out **static** routes in your project.

*For basic routes, you do not have to do anything manually.*

<br>

### Dynamic Routes

*You will still have to map dynamic routes yourself!*

```ts
// ./routes/sitemap.xml.ts
import { SitemapContext } from 'https://deno.land/x/fresh_seo/mod.ts';
import { Handlers } from '$fresh/server.ts';
import manifest from '../fresh.gen.ts';

export const handler : Handlers = {
    GET(request,context){
        const sitemap = new SitemapContext(
            'http://example.com', // put your domain here
            manifest
        );

        // you can add additional page here
        sitemap.add('/blog/hello-world');

        return sitemap.render();
    }
}
```

*You can also remove unwanted routes*

```ts
// ./routes/sitemap.xml.ts
import { SitemapContext } from 'https://deno.land/x/fresh_seo/mod.ts';
import { Handlers } from '$fresh/server.ts';
import manifest from '../fresh.gen.ts';

export const handler : Handlers = {
    GET(request,context){
        const sitemap = new SitemapContext(
            'http://example.com',
            manifest
        );

        // You can remove unwanted routes here
        sitemap.remove('/admin');

        return sitemap.render();
    }
}
```

<br>
<br>

## Testing

The test suite can be started with

```shell
deno task test
```

<br>

<!----------------------------------------------------------------------------->

[Fresh project]: https://fresh.deno.dev/
[Localhost]: http://localhost:8000/sitemap.xml

[License]: LICENSE


<!----------------------------------[ Badges ]--------------------------------->

[Badge License]: https://img.shields.io/badge/License-MIT-ac8b11.svg?style=for-the-badge&labelColor=yellow
