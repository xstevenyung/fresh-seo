import { MiddlewareHandlerContext } from "$fresh/server.ts";

export const handler = [timing];

async function timing(
  _req: Request,
  ctx: MiddlewareHandlerContext
): Promise<Response> {
  const start = performance.now();
  const res = await ctx.next();
  const end = performance.now();
  const dur = (end - start).toFixed(1);
  res.headers.set("Server-Timing", `handler;dur=${dur}`);
  return res;
}
