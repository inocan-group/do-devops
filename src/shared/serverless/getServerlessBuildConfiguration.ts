import { IDictionary, IServerlessAccountInfo } from "common-types";
import { TypedMapper } from "typed-mapper";
import {
  askForAccountInfo,
  getAccountInfoFromServerlessYaml,
  getPackageJson,
  getYeomanConfig,
  getYeomanScaffolds,
} from "../../shared";

function transformYeomanFormat(input: IDictionary) {
  return TypedMapper.map<IDictionary, IServerlessAccountInfo>({
    name: "serviceName",
    accountId: "awsAccount",
    profile: "awsProfile",
    region: "awsRegion",
    devDependencies: (): string[] => [],
    pluginsInstalled: (): string[] => [],
  }).convertObject(input);
}

/**
 * Will find the appropriate configuration information
 * for the serverless build process. Looking either in
 * the `serverless-config/account-info.yml` (deprecated)
 * or pulled from the Yeoman templates's `.yo-rc.json` file.
 *
 * If the info is not found in either location then it
 * will switch to interactive mode to get the data it
 * needs.
 */
export async function getServerlessBuildConfiguration(): Promise<IServerlessAccountInfo> {
  const modern = getYeomanScaffolds().includes("generator-lambda-typescript");
  const knownAccountInfo: Partial<IServerlessAccountInfo> = {
    ...(modern
      ? transformYeomanFormat(getYeomanConfig())
      : await getAccountInfoFromServerlessYaml()),
    devDependencies: Object.keys(getPackageJson().devDependencies || {}),
    pluginsInstalled: Object.keys(getPackageJson().devDependencies || {}).filter((i) =>
      i.startsWith("serverless-")
    ),
  };

  const accountInfo = await askForAccountInfo(knownAccountInfo);

  return accountInfo;
}
