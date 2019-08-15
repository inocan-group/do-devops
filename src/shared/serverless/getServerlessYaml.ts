import { IServerlessConfig } from "common-types";
import { safeLoad } from "js-yaml";
import path from "path";
import { DevopsError } from "../errors";

/**
 * Get the `serverless.yml` file in the root of the project; if
 * the file does not exist then return _false_
 */
export async function getServerlessYaml(): Promise<IServerlessConfig> {
  try {
    const config: IServerlessConfig = safeLoad(
      path.join(process.cwd(), "serverless.yml")
    );
    return config;
  } catch (e) {
    throw new DevopsError(
      `Failure getting serverless.yml: ${e.message}`,
      e.name
    );
  }
}
