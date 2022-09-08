// deno-lint-ignore-file no-explicit-any

export interface Manifest {
  routes: Record<string,any>;
  islands: Record<string, any>;
  baseUrl: string;
}