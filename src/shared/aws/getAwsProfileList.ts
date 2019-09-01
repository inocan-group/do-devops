import { hasAwsProfileCredentialsFile } from "../index";
import { IDictionary } from "common-types";
import { readFile } from "../readFile";

export interface IAwsProfile {
  aws_access_key_id: string;
  aws_secret_access_key: string;
  region?: string;
}

/**
 * Interogates the `~/.aws/credentials` file to get a hash of
 * profiles (name/dictionary of values) the user has available.
 *
 * Returns _false_ if the credentials file is not found.
 */
export async function getAwsProfileList() {
  try {
    const credentialsFile = hasAwsProfileCredentialsFile();
    if (!credentialsFile) {
      return false;
    }

    const data = await readFile(credentialsFile);
    const targets = ["aws_access_key_id", "aws_secret_access_key", "region"];

    // extracts structured information from the semi-structured
    // array of arrays
    const extractor = (
      agg: IDictionary<Partial<IAwsProfile>>,
      curr: string[]
    ) => {
      let profileSection = "unknown";
      curr.forEach(lineOfFile => {
        if (lineOfFile.slice(-1) === "]") {
          profileSection = lineOfFile.slice(0, lineOfFile.length - 1);
          agg[profileSection] = {};
        }
        targets.forEach(t => {
          if (lineOfFile.includes(t)) {
            const [devnull, key, value] = lineOfFile.match(
              /\s*(\S+)\s*=\s*(\S+)/
            );

            agg[profileSection][key as keyof IAwsProfile] = value;
          }
        });
      });
      return agg as IDictionary<IAwsProfile>;
    };
    const credentials = data
      .split("[")
      .map(i => i.split("\n"))
      .reduce(extractor, {} as IDictionary<IAwsProfile>) as IDictionary<
      IAwsProfile
    >;

    return credentials;
  } catch (e) {
    return false;
  }
}
