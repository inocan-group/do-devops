import { IDictionary } from "common-types";

export interface IDoHandler {
  handler(argv: string[], options?: IDictionary): void;
}

export interface IServerlessAccountInfo {
  name?: string;
  accountId?: string;
  region?: string;
  profile?: string;
}

export type ISandboxStrategy = "dev" | "user" | "branch";
