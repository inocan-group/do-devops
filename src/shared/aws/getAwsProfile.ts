import { getAwsProfileDictionary } from "./index";
import { DevopsError } from "src/errors/index";
import { IAwsProfile } from "src/@types";

/**
 * Get a specific AWS _profile_ in the AWS _credentials_ file.
 *
 * Possible errors:
 *   - `do-devops/invalid-profile-name`
 *   - `do-devops/no-credentials-file`
 */
export async function getAwsProfile(profileName: string): Promise<IAwsProfile> {
  const profile = await getAwsProfileDictionary();
  if (!profile) {
    throw new DevopsError(
      `Attempt to get the AWS profile "${profileName}" failed because the AWS credentials file does not exist!`,
      "do-devops/no-credentials-file"
    );
  }
  if (!profile[profileName]) {
    throw new DevopsError(
      `The AWS profile "${profileName}" does not exist in the AWS credentials file! Valid profile names are: ${Object.keys(
        profile
      ).join(", ")}`,
      "do-devops/invalid-profile-name"
    );
  }
  return profile[profileName];
}
