import { IAwsCredentials, IAwsOptions } from "~/@types";
import { convertProfileToApiCredential, getAwsProfile } from "../aws";
import { determineProfile } from "./determineProfile";

export type ICredentialsWithMeta = {
  credentials: IAwsCredentials;
  profile: string;
  region?: string;
};

/**
 * **determineCredentials**
 *
 * Determines -- based on the environment and passed in options -- what
 * the right AWS _profile_ is and then returns the profile
 * along with the user's credentials.
 *
 * If the _profile_ can not be determined then this function returns `false`,
 * but if it can figure out a profile _name_ but the profile doesn't exist
 * in the user's `~/.aws/credentials` file, it will throw an error.
 *
 * **Errors:**
 * - `do-devops/invalid-profile-name`
 * - `do-devops/no-credentials-file`
 * - `do-devops/invalid-aws-profile` - this is very unlikely
 */
export async function determineCredentials(
  opts: IAwsOptions
): Promise<ICredentialsWithMeta | false> {
  const profile = await determineProfile(opts);
  if (!profile) {
    return false;
  }
  const credentials = await getAwsProfile(profile);
  const region = credentials.region || opts.region;

  return region
    ? {
        credentials: convertProfileToApiCredential(credentials),
        profile,
        region,
      }
    : { credentials: convertProfileToApiCredential(credentials), profile };
}
