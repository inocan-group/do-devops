import { getAwsProfileDictionary } from "./index";

/**
 * Indicates whether the given user has the _credentials_ for a given
 * AWS profile.
 */
export async function userHasAwsProfile(profileName: string) {
  const profiles = Object.keys(await getAwsProfileDictionary());

  return profiles.includes(profileName);
}
