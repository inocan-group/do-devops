import { getServerlessYaml } from "../serverless/getServerlessYaml";
import { getConfig } from "..";
import inquirer = require("inquirer");
import fs from "fs";
import path from "path";
import { IDictionary, IServerlessConfig } from "common-types";
import { readFile } from "../readFile";
import { DevopsError } from "../errors/DevopsError";

/**
 * Gets the "default" profile for a given repo based on:
 *
 * - the `serverless.yml` file
 * - the `do.config.js` file
 *
 * If not found it will switch over to _interactive mode_.
 */
export async function getDefaultAwsProfile() {
  let serverlessYaml: false | IServerlessConfig;
  try {
    serverlessYaml = await getServerlessYaml();
  } catch (e) {
    serverlessYaml = false;
  }
  const config = await getConfig();
  let profile: string;
  if (serverlessYaml && serverlessYaml.provider.profile) {
    profile = serverlessYaml.provider.profile;
  } else if (config.ssm.defaultProfile) {
    profile = config.ssm.defaultProfile;
  } else {
    profile = await askForAwsProfile();
  }
}

/**
 * Returns the path to the file if found, if not found then returns
 * `false`.
 */
export function hasAwsProfileCredentialsFile() {
  const homedir = require("os").homedir();
  const filePath = path.join(homedir, ".aws/credentials");
  return fs.existsSync(filePath) ? filePath : false;
}

export interface IAwsProfile {
  aws_access_key_id: string;
  aws_secret_access_key: string;
  region?: string;
}

/**
 * Interogates the `~/.aws/credentials` file to get a hash of
 * profiles (name/dictionary of values) the user has available.
 * Returns _false_ if the credentials file is not found.
 */
export async function getAwsProfileList(): Promise<
  IDictionary<IAwsProfile> | false
> {
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

/**
 * Get a specific _named profile_ in the AWS `credentials` file
 */
export async function getAwsProfile(profileName: string) {
  const profile = await getAwsProfileList();
  if (!profile) {
    throw new DevopsError(
      `Attempt to get the AWS profile "${profileName}" failed because the AWS credentials file does not exist!`,
      "devops/not-ready"
    );
  }
  return profile[profileName];
}

/**
 * Asks the user to choose an AWS profile
 */
export async function askForAwsProfile(): Promise<string> {
  const profiles = await getAwsProfileList();
  const question: inquirer.InputQuestion = {
    type: "input",
    name: "profile",
    message: "Choose an AWS profile from your credentials file"
  };
  const answer = await inquirer.prompt(question);
  return;
}

/**
 * Asks the user to choose an AWS region
 */
export async function askForAwsRegion(): Promise<string> {
  const question: inquirer.ListQuestion = {
    type: "list",
    name: "region",
    message: "What AWS region do you want to target?",
    default: "us-east-1",
    choices: [
      "us-east-1",
      "us-east-2",
      "us-west-1",
      "us-west-2",
      "eu-west-1",
      "eu-west-2",
      "eu-west-3",
      "eu-north-1",
      "eu-central-1",
      "sa-east-1",
      "ca-central-1",
      "ap-south-1",
      "ap-northeast-1",
      "ap-northeast-2",
      "ap-northeast-3",
      "ap-southeast-1",
      "ap-southeast-2"
    ]
  };
  return;
}
