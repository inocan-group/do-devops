import { IServerlessYaml } from "common-types";
import { get } from "lodash";
import { getServerlessYaml } from "~/shared/serverless";
import { IDetermineOptions, IDoConfig } from "~/@types";
import { DevopsError } from "~/errors";
import { getConfig } from "~/shared/do-config";
import { askForAwsProfile } from "~/shared/aws";

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
  if (opts.cliOptions && opts.cliOptions.profile) {
    return opts.cliOptions.profile;
  }

  let serverlessYaml: IServerlessYaml;
  try {
    serverlessYaml = await getServerlessYaml();
    if (get(serverlessYaml, "provider.profile")) {
      profile = serverlessYaml.provider.profile as string;
      return profile;
    }
  } catch {
    // nothing to do
  }
  let doConfig: IDoConfig;
  try {
    doConfig = await getConfig("both");

    if (doConfig && doConfig.global.defaultAwsProfile) {
      profile = doConfig.global.defaultAwsProfile;
    }
  } catch {}

  if (!profile && opts.interactive) {
    try {
      profile = await askForAwsProfile({ exitOnError: false });
      // TODO: what should be done with this?
      // const _saveForNextTime = await askToSaveConfig("global.defaultAwsProfile", profile);
    } catch {}
  }

  if (!profile) {
    throw new DevopsError(
      `Could not determine the AWS profile! [ ${JSON.stringify(opts)}]`,
      "devops/not-ready"
    );
  }

  return profile;
}
