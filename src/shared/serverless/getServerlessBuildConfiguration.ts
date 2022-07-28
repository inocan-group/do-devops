import { IDictionary, IServerlessAccountInfo } from "common-types";
import { TypedMapper } from "typed-mapper";
import { DevopsError } from "src/errors";
import { askForAccountInfo, getAccountInfoFromServerlessYaml } from "src/shared/serverless";
import { getPackageJson } from "../npm";
import { getYeomanConfig, getYeomanScaffolds } from "../yeoman";

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
  const pkg = getPackageJson();
  if (!pkg) {
    throw new DevopsError(
      `Attempt to build Serverless configuration failed as there is no package.json the current working directory!`,
      "not-ready/missing-package-json"
    );
  }
  const knownAccountInfo = {
    ...(modern
      ? transformYeomanFormat(getYeomanConfig())
      : await getAccountInfoFromServerlessYaml()),
    devDependencies: Object.keys(pkg.devDependencies || {}),
    pluginsInstalled: Object.keys(pkg.devDependencies || {}).filter((i) =>
      i.startsWith("serverless-")
    ),
  } as Partial<IServerlessAccountInfo>;

  const accountInfo = await askForAccountInfo(knownAccountInfo);

  return accountInfo;
}
