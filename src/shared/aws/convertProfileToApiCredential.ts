import chalk from "chalk";
import { IAwsCredentials, IAwsProfile } from "src/@types";
import { DevopsError } from "src/errors";
import { isAwsProfile } from "./aws-type-guards";

/**
 * **convertProfileToApiCredential**
 *
 * Converts the `IAwsProfile` format (which mimics the snake_case naming you have in the credentials file) and
 * converts it to an `IAwsCredentials` shape which can be used directly in credentializing an
 * API call.
 *
 * **Errors:**
 *   - `do-devops/invalid-aws-profile`
 */
export function convertProfileToApiCredential(profile: IAwsProfile): IAwsCredentials {
  if (!isAwsProfile(profile)) {
    const isObject = typeof profile === "object" && profile !== null;
    throw new DevopsError(
      chalk`The {bold {red IAwsProfile}} information which was passed in to be converted to {bold IAwsCredentials} data was malformed and can not be converted! To be valid a key it must have both {green aws_access_key_id} and {green aws_secret_access_key} defined. [${
        isObject
          ? "keys found were " + Object.keys(profile).join(", ")
          : `wrong type: ${typeof profile}`
      }]\n\n`,
      "do-devops/invalid-aws-profile"
    );
  }

  return {
    accessKeyId: profile.aws_access_key_id,
    secretAccessKey: profile.aws_secret_access_key,
  };
}
