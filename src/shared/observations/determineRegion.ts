/* eslint-disable unicorn/no-useless-undefined */
import chalk from "chalk";
import { get } from "lodash";
import { IDetermineOptions } from "../../@types";
import { determineProfile } from "./determineProfile";
import { emoji } from "../ui";
import { getAwsProfile } from "../aws";
import { getConfig } from "../index";
import { getServerlessYaml } from "../serverless/getServerlessYaml";

/**
 * Determines the appropriate `region` to point at based on CLI switches/options,
 * the Serverless configuration, and the global `do` config defaults.
 */
export async function determineRegion(opts?: IDetermineOptions) {
  const config = await getConfig();
  const cliRegion = get(opts, "cliOptions.region");
  let outcome = cliRegion || process.env.AWS_REGION;

  if (!outcome) {
    try {
      outcome = get(await getServerlessYaml(), "provider.region", undefined);
    } catch {}
  }
  if (!outcome) {
    outcome = get(config, "global.defaultAwsRegion", undefined);
  }

  if (!outcome) {
    try {
      const profileName = await determineProfile(opts || {});
      const profile = await getAwsProfile(profileName);
      if (profile && profile.region) {
        outcome = profile.region;
      }
    } catch {}
  }

  // USER Config is last resort
  if (!outcome) {
    const userConfig = await getConfig("user");
    if (userConfig && userConfig.global.defaultAwsRegion) {
      if (opts?.cliOptions && !opts.cliOptions.quiet) {
        console.log(
          chalk`{bold - AWS region has been resolved using the User's config ${emoji.eyeballs}}. This is the source of "last resort" but may be intended.`
        );
      }
      outcome = userConfig.global.defaultAwsRegion;
    }
  }

  return outcome;
}
