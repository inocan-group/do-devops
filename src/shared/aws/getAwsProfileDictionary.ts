/* eslint-disable unicorn/no-array-callback-reference */
import { IAwsProfile } from "src/@types";
import { AwsRegion, IDictionary } from "common-types";
import { hasAwsProfileCredentialsFile } from "src/shared/aws";
import { readFile } from "src/shared/file";

/**
 * **getAwsProfileDictionary**
 *
 * Interogates the `src/.aws/credentials` file to get a hash of
 * profiles (name/dictionary of values) the user has available.
 *
 * If the file isn't found then an empty object is returned.
 */
export async function getAwsProfileDictionary(): Promise<Record<string, IAwsProfile>> {
  try {
    const credentialsFile = hasAwsProfileCredentialsFile();
    if (!credentialsFile) {
      return {};
    }

    const data = await readFile(credentialsFile);
    const targets = ["aws_access_key_id", "aws_secret_access_key", "region"];

    // extracts structured information from the semi-structured
    // array of arrays
    const extractor = (agg: IDictionary<Partial<IAwsProfile>>, curr: string[]) => {
      let profileSection = "unknown";
      for (const lineOfFile of curr) {
        if (lineOfFile.slice(-1) === "]") {
          profileSection = lineOfFile.slice(0, -1);
          agg[profileSection] = {};
        }
        for (const t of targets) {
          if (lineOfFile.includes(t)) {
            const [_, key, value] = lineOfFile.match(/\s*(\S+)\s*=\s*(\S+)/) as [
              unknown,
              string & keyof IAwsProfile,
              string
            ];

            if (key === "region") {
              agg[profileSection][key] = value as AwsRegion;
            } else {
              agg[profileSection][key] = value as string;
            }
          }
        }
      }
      return agg as IDictionary<IAwsProfile>;
    };
    const credentials = data
      ? (data
          .split("[")
          .map((i) => i.split("\n"))
          .reduce(extractor, {} as IDictionary<IAwsProfile>) as IDictionary<IAwsProfile>)
      : {};

    return credentials;
  } catch {
    return {};
  }
}
