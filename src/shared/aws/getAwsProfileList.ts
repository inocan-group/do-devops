/* eslint-disable unicorn/no-array-callback-reference */
import { IAwsProfile } from "~/@types";
import { getAwsProfileDictionary } from "./getAwsProfileDictionary";

/**
 * **getAwsProfileList**
 *
 * Interogates the `~/.aws/credentials` file to get an array of
 * profiles which the user has defined.
 *
 * Note: _there is also a_ `getAwsProfileDictionary()` _function if
 * prefer a dictionary._
 */
export async function getAwsProfileList(): Promise<
  Array<IAwsProfile & { name: string }>
> {
  const dict = await getAwsProfileDictionary();
  const keys = Object.keys(dict);
  if (keys.length === 0) {
    return [];
  }
  return keys.map((i) => ({ ...dict[i], name: i }));
}
