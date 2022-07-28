import { EC2 } from "aws-sdk";
import { DevopsError } from "src/errors";
import { convertProfileToApiCredential } from "./convertProfileToApiCredential";
import { getAwsProfile } from "./getAwsProfile";
/**
 * Given a stated AWS profile that exists in a user's credentials file,
 * this function will use the AWS SDK to determine the default region
 * for the profile.
 */
export async function getAwsDefaultRegion(profileName: string) {
  const profile = await getAwsProfile(profileName);
  const credential = convertProfileToApiCredential(profile);
  if (!credential) {
    throw new DevopsError(
      `Could not get the credentials for the profile "${profileName}".`,
      "not-allowed/no-credentials"
    );
  }

  const api = new EC2({ ...credential });
  return api.describeAvailabilityZones().promise();
}
