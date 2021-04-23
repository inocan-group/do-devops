import { get } from "lodash";
import { getServerlessYaml } from "~/shared/serverless";
import { IDoConfig } from "~/@types";
import { DevopsError } from "~/errors";
import { getConfig, IGlobalOptions } from "~/shared/core";
import { askForAwsProfile } from "~/shared/aws";
import { DoDevopObservation } from "~/@types/observations";

/** ensure that during one CLI operation we cache this value */
let profile: string;

export interface IProfileOptions extends IGlobalOptions {
  profile?: string;
  interactive?: boolean;
}

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
export async function determineProfile(
  opts: IProfileOptions,
  observations: DoDevopObservation[] = []
): Promise<string> {
  if (opts.profile) {
    return opts.profile;
  }

  if (observations.includes("serverlessYml")) {
    try {
      const serverlessYaml = await getServerlessYaml();
      if (get(serverlessYaml, "provider.profile")) {
        profile = serverlessYaml.provider.profile as string;
        return profile;
      }
    } catch {}
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
