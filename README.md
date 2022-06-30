# 🦕 deno-module-starter

[Deno](https://deno.land) module starter repository.

## Usage

```typescript
import { getHelloWorld } from "https://raw.githubusercontent.com/BrunnerLivio/deno-module-starter/{VERSION}/mod.ts";

const helloWorld = getHelloWorld();
console.log(helloWorld); // Prints "Hello World" in bold
```

## Test

```bash
# unit tests
deno ./test.ts
```

## Format code

```bash
deno fmt **/*.ts
```

## Resources

- [Deno Website](https://deno.land)
- [Deno Style Guide](https://deno.land/std/style_guide.md)
- [Deno Gitter](https://gitter.im/denolife/Lobby)