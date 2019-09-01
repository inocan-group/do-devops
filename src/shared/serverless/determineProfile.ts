import { IServerlessConfig, IDictionary } from "common-types";
import {
  getServerlessYaml,
  getConfig,
  askForAwsProfile,
  DevopsError,
  IDetermineOptions
} from "../index";

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
export async function determineProfile(opts: IDetermineOptions) {
  if (profile) {
    return profile;
  }

  if (opts.cliOptions.profile) {
    return opts.cliOptions.profile;
  }

  let serverlessYaml: IServerlessConfig;
  try {
    serverlessYaml = await getServerlessYaml();
    if (serverlessYaml.provider.profile) {
      profile = serverlessYaml.provider.profile;
      return profile;
    }
  } catch (e) {
    // nothing to do
  }
  let projectConfig;
  let userConfig;
  try {
    projectConfig = await getConfig({
      exitIfNotFound: false,
      projectOrUserConfig: "project"
    });
  } catch (e) {}

  try {
    userConfig = await getConfig({
      exitIfNotFound: false,
      projectOrUserConfig: "user"
    });
  } catch (e) {}

  if (projectConfig && projectConfig.global.defaultAwsProfile) {
    profile = projectConfig.global.defaultAwsProfile;
  } else if (userConfig && userConfig.global.defaultAwsProfile) {
    profile = userConfig.global.defaultAwsProfile;
  } else if (opts.interactive) {
    try {
      profile = await askForAwsProfile({ exitOnError: false });
    } catch (e) {}
  }

  if (!profile) {
    throw new DevopsError(
      `Could not determine the AWS profile! [ ${JSON.stringify(opts)}]`,
      "devops/not-ready"
    );
  }

  return profile;
}
