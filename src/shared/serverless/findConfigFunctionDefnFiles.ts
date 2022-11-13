import { globbySync as sync } from "globby";
import path from "node:path";

/**
 * Finds all function configuration files in the `typescript-microservice`
 * configuration directory.
 */
export function findConfigFunctionDefnFiles(basePath?: string) {
  const glob = basePath
    ? path.join(basePath, "*.ts")
    : path.join(process.env.PWD || "", "/serverless-config/functions/**/*.ts");
  return sync([
    glob,
    path.join(basePath || process.env.PWD || "", "serverless-config/functions.ts"),
  ]) as string[];
}
