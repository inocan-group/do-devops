/* eslint-disable unicorn/no-useless-undefined */
import chalk from "chalk";
import { get } from "native-dash";
import { determineProfile } from "./index";
import { emoji } from "~/shared/ui";
import { getAwsProfile } from "~/shared/aws";
import { getServerlessYaml } from "~/shared/serverless";
import { DoDevopObservation } from "~/@types/observations";
import { getIntegratedConfig, getUserConfig } from "~/shared/config";
import { configIsReady, Options } from "~/@types";

export interface IRegionOptions extends Options {
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
  observations: Set<DoDevopObservation> = new Set<DoDevopObservation>()
) {
  const config = getIntegratedConfig();
  let region = opts.region || process.env.AWS_REGION;

  if (!region && observations.has("serverlessYml")) {
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
    if (configIsReady(userConfig) && userConfig.aws?.defaultRegion) {
      if (!opts.quiet) {
        console.log(
          chalk`{bold - AWS region has been resolved using the User's config ${emoji.eyeballs}}. This is the source of "last resort" but may be intended.`
        );
      }
      region = userConfig.aws.defaultRegion;
    }
  }

  return region;
}
