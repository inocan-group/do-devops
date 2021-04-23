import { getAwsProfileDictionary } from "./index";
import { DevopsError } from "~/errors/index";

/**
 * Get a specific _named profile_ in the AWS `credentials` file;
 * throws `devops/not-ready` if error.
 */
export async function getAwsProfile(profileName: string) {
  const profile = await getAwsProfileDictionary();
  if (!profile) {
    throw new DevopsError(
      `Attempt to get the AWS profile "${profileName}" failed because the AWS credentials file does not exist!`,
      "devops/not-ready"
    );
  }
  if (!profile[profileName]) {
    throw new DevopsError(
      `The AWS profile "${profileName}" does not exist in the AWS credentials file! Valid profile names are: ${Object.keys(
        profile
      ).join(", ")}`,
      "devops/not-ready"
    );
  }
  return profile[profileName];
}
