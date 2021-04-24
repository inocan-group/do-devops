/* eslint-disable unicorn/no-useless-undefined */
import chalk from "chalk";
import { get } from "lodash";
import { determineProfile } from "./determineProfile";
import { emoji } from "../ui";
import { getAwsProfile } from "../aws";
import { getServerlessYaml } from "../serverless/getServerlessYaml";
import { DoDevopObservation } from "~/@types/observations";
import { getConfig, IGlobalOptions } from "../core";

export interface IRegionOptions extends IGlobalOptions {
  interactive?: boolean;
  region?: string;
  profile?: string;
}

/**
 * Determines the appropriate `region` to point at based on CLI switches/options,
 * the Serverless configuration, and the global `do` config defaults.
 */
export async function determineRegion(
  opts: IRegionOptions = {},
  observations: DoDevopObservation[] = []
) {
  const config = await getConfig();
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
    const userConfig = await getConfig("user");
    if (userConfig && userConfig.global.defaultAwsRegion) {
      if (!opts.quiet) {
        console.log(
          chalk`{bold - AWS region has been resolved using the User's config ${emoji.eyeballs}}. This is the source of "last resort" but may be intended.`
        );
      }
      region = userConfig.global.defaultAwsRegion;
    }
  }

  return region;
}
