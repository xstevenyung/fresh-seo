import { Config } from "./types.ts";

export interface MetaProps {
  title?: string;
  description?: string;
  keywords?: string;
  imageUrl?: string;
  type?: string;
  url?: string;
}

export function getMetaProps(config: Config, req: Request): MetaProps {
  const reqUrl = new URL(req.url);
  const { description, title, keywords, imageUrl, type, url } =
    config.routes[reqUrl.pathname];
  return {
    description,
    title,
    keywords,
    imageUrl,
    url: url ?? reqUrl.href,
    type,
  };
}
