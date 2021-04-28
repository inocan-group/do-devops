/* eslint-disable unicorn/no-array-callback-reference */
import { IAwsProfile } from "~/@types";
import { IDictionary } from "common-types";
import { hasAwsProfileCredentialsFile } from "~/shared/aws";
import { readFile } from "~/shared/file/readFile";

/**
 * **getAwsProfileDictionary**
 *
 * Interogates the `~/.aws/credentials` file to get a hash of
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
              string,
              string
            ];

            agg[profileSection][key as keyof IAwsProfile] = value;
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
