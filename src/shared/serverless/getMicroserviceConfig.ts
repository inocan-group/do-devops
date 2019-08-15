import { IServerlessConfig } from "common-types";
import { IServerlessAccountInfo } from "../@types";
import path from "path";

/**
 * Gets the typescript configuration file for serverless
 * projects which use the `typescript-microservice` yeoman
 * template.
 */
export async function getMicroserviceConfig() {
  const config = (await import(
    path.join(process.cwd(), "serverless-config", "config.ts")
  )).default as (accountInfo: IServerlessAccountInfo) => IServerlessConfig;
}
