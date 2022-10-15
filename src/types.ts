// deno-lint-ignore-file no-explicit-any
import { MetaProps } from "./meta.ts";

export interface Manifest {
  routes: Record<string, any>;
  islands: Record<string, any>;
  baseUrl: string;
}

export interface Route {
  pathName: string;
  changefreq?: ChangeFrequency;
  priority?: Priority;
  lastmod?: Date;
}

export interface RouteProps {
  changefreq?: ChangeFrequency;
  priority?: Priority;
  lastmod?: Date;
}

export type ChangeFrequency =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

export type Priority =
  | "0.0"
  | "0.1"
  | "0.2"
  | "0.3"
  | "0.4"
  | "0.5"
  | "0.6"
  | "0.7"
  | "0.8"
  | "0.9"
  | "1.0";

export interface Config {
  routes: Record<string, MetaProps>;
}
