/* eslint-disable unicorn/no-useless-undefined */
import chalk from "chalk";
import { get } from "lodash";
import { determineProfile } from "./index";
import { emoji } from "~/shared/ui";
import { getAwsProfile } from "~/shared/aws";
import { getServerlessYaml } from "~/shared/serverless";
import { DoDevopObservation } from "~/@types/observations";
import { getIntegratedConfig, getUserConfig, IGlobalOptions } from "~/shared/core";
import { configIsReady } from "~/@types";

export interface IRegionOptions extends IGlobalOptions {
  interactive?: boolean;
  region?: string;
  profile?: string;
}

/**
 * Determines the appropriate AWS `region` to point at based on CLI switches/options,
 * the Serverless configuration, and the global `do` config defaults.
 *
 * If an appropriate region can't be determined this function will return `false`.
 */
export async function determineRegion(
  opts: IRegionOptions = {},
  observations: DoDevopObservation[] = []
) {
  const config = getIntegratedConfig();
  let region = opts.region || process.env.AWS_REGION;

  if (!region && observations.includes("serverlessYml")) {
    try {
      region = get(await getServerlessYaml(), "provider.region", undefined);
    } catch {}
  }

  if (!region) {
    region = get(config, "global.defaultAwsRegion", undefined);
  }

  // attempt to find it in the credentials file for the given profile
  if (!region) {
    const profileName = await determineProfile(opts || {});
    if (profileName) {
      const profile = await getAwsProfile(profileName);
      if (profile && profile.region) {
        region = profile.region;
      }
    }
  }

  // USER Config is last resort
  if (!region) {
    const userConfig = getUserConfig();
    if (configIsReady(userConfig) && userConfig.general?.defaultAwsRegion) {
      if (!opts.quiet) {
        console.log(
          chalk`{bold - AWS region has been resolved using the User's config ${emoji.eyeballs}}. This is the source of "last resort" but may be intended.`
        );
      }
      region = userConfig.general.defaultAwsRegion;
    }
  }

  return region;
}
