import { getAwsProfileList } from "./index";

/**
 * Indicates whether the given user has the _credentials_ for a given
 * AWS profile.
 */
export async function userHasAwsProfile(profileName: string) {
  const profiles = Object.keys(await getAwsProfileList());

  return profiles.includes(profileName);
}
