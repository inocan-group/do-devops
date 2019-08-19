import fs from "fs";
import path from "path";
import { getPackageJson } from "../npm";
import { IServerlessConfig } from "common-types";
import { getServerlessYaml } from "./getServerlessYaml";

export interface IIsServerless {
  /** validates that the `serverless.yml` file exists */
  hasServerlessConfig: boolean;
  /**
   * Indicates whether the Serverless framework's npm module
   * is in the **devDeps** section of the package.json.
   */
  hasAsDevDep: boolean;
  /**
   * Indicates whether this project was originated from the
   * `typescript-microservice` yeoman template
   */
  isUsingTypescriptMicroserviceTemplate: boolean;
  /**
   * the **provider** section is critical and sometimes the `serverless.yml` file
   * might exist but if it doesn't have this section then this is typically
   * problematic.
   */
  hasProviderSection: boolean;
  /** indicates that the `serverless.yml` file not only exists but is parsable */
  configIsParsable: boolean;
}

/**
 * returns a set of flags indicating whether it appears the serverless framework
 * is being used in this repo
 */
export async function isServerless(): Promise<IIsServerless | false> {
  const hasServerlessConfig = fs.existsSync(
    path.join(process.cwd(), "serverless.yml")
  );
  let slsConfig: IServerlessConfig;
  try {
    slsConfig = await getServerlessYaml();
  } catch (e) {
    //
  }
  const pkgJson = getPackageJson();
  const hasAsDevDep = pkgJson
    ? Object.keys(pkgJson.devDependencies).includes("serverless")
    : false;
  const isUsingTypescriptMicroserviceTemplate = fs.existsSync(
    path.join(process.cwd(), "serverless-config/config.ts")
  );
  const hasProviderSection = slsConfig && slsConfig.provider ? true : false;
  const configIsParsable = hasServerlessConfig && slsConfig ? true : false;

  return hasServerlessConfig ||
    hasAsDevDep ||
    isUsingTypescriptMicroserviceTemplate
    ? {
        hasServerlessConfig,
        hasAsDevDep,
        isUsingTypescriptMicroserviceTemplate,
        hasProviderSection,
        configIsParsable
      }
    : false;
}
