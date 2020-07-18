import { IServerlessConfig, IDictionary } from "common-types";
import { getServerlessYaml, getConfig, askForAwsProfile, DevopsError, askToSaveConfig } from "../index";
import { IDetermineOptions, IDoConfig } from "../../@types";
import { get } from "lodash";

/** ensure that during one CLI operation we cache this value */
let profile: string;

/**
 * Based on CLI, serverless info, and config files, determine which
 * AWS `profile` the serverless command should leverage for credentials
 * as well as -- optionally -- the _region_. Sequence is:
 *
 * - look at `CLI switches` for explicit statement about profile
 * - if serverlessYaml, use serverless config to determine
 * - look at the global default for the `project configuration`
 * - look at the global default for the `user configuration`
 * - if "interactive", then ask user for profile name from available options
 */
export async function determineProfile(opts: IDetermineOptions): Promise<string> {
  if (get(opts, "cliOptions.profile", undefined)) {
    return opts.cliOptions.profile;
  }

  let serverlessYaml: IServerlessConfig;
  try {
    serverlessYaml = await getServerlessYaml();
    if (get(serverlessYaml, "provider.profile", undefined)) {
      profile = serverlessYaml.provider.profile;
      return profile;
    }
  } catch (e) {
    // nothing to do
  }
  let doConfig: IDoConfig;
  try {
    doConfig = await getConfig("both");

    if (doConfig && doConfig.global.defaultAwsProfile) {
      profile = doConfig.global.defaultAwsProfile;
    }
  } catch (e) {}

  if (!profile && opts.interactive) {
    try {
      profile = await askForAwsProfile({ exitOnError: false });
      const saveForNextTime = await askToSaveConfig("global.defaultAwsProfile", profile);
    } catch (e) {}
  }

  if (!profile) {
    throw new DevopsError(`Could not determine the AWS profile! [ ${JSON.stringify(opts)}]`, "devops/not-ready");
  }

  return profile;
}
