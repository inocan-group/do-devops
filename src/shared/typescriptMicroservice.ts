import { IServerlessConfig } from "common-types";
import { IServerlessAccountInfo } from "./@types";
import path from "path";

export async function getMicroserviceConfig() {
  const config = (await import(
    path.join(process.cwd(), "serverless-config", "config.ts")
  )).default as (accountInfo: IServerlessAccountInfo) => IServerlessConfig;
}
