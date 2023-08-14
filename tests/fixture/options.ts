import { freshSEOPlugin } from "fresh-seo";
import manifest from "./fresh.gen.ts";
export const options = {
  plugins: [freshSEOPlugin(manifest)],
};
