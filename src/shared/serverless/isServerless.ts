import fs from "fs";
import path from "path";
import { getPackageJson } from "../npm";

export interface IIsServerless {
  hasServerlessConfig: boolean;
  hasAsDevDep: boolean;
  isUsingTypescriptMicroserviceTemplate: boolean;
}

/**
 * returns a set of flags indicating whether it appears the serverless framework
 * is being used in this repo
 */
export function isServerless(): IIsServerless | false {
  const hasServerlessConfig = fs.existsSync(
    path.join(process.cwd(), "serverless.yml")
  );
  const pkgJson = getPackageJson();
  const hasAsDevDep = pkgJson
    ? Object.keys(pkgJson.devDependencies).includes("serverless")
    : false;
  const isUsingTypescriptMicroserviceTemplate = fs.existsSync(
    path.join(process.cwd(), "serverless-config/config.ts")
  );

  return hasServerlessConfig ||
    hasAsDevDep ||
    isUsingTypescriptMicroserviceTemplate
    ? {
        hasServerlessConfig,
        hasAsDevDep,
        isUsingTypescriptMicroserviceTemplate
      }
    : false;
}
