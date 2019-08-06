import { getServerlessYml } from "./serverlessConfig";
import { getConfig } from "../shared";
import inquirer = require("inquirer");
import fs from "fs";
import { IDictionary } from "common-types";

/**
 * Gets the "default" profile for a given repo based on:
 *
 * - the `serverless.yml` file
 * - the `do.config.js` file
 *
 * If not found it will switch over to _interactive mode_.
 */
export async function getDefaultAwsProfile() {
  const serverlessYaml = await getServerlessYml();
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
 * Interogates the `~/.aws/credentials` file to get a list of
 * profiles the user has available. Returns _false_ if the credentials file
 * is not found.
 *
 * Alternatively you can state a particular `profile` which you
 * want the details on by specifying the profile name as part of
 * the calling arguments. In this case if the profile stated is
 * not found it will throw the error `do-devops/not-found`
 */
export async function getAwsProfileList(
  profile?: string
): Promise<IDictionary<string> | Array<IDictionary<string>> | false> {
  try {
    const homedir = require("os").homedir();
    const filter = profile ? i => i[0].includes(profile) : i => i;
    let credentials = fs
      .readFileSync(`${homedir}/.aws/credentials`, { encoding: "utf-8" })
      .split("[")
      .map(i => i.split("\n"))
      .filter(filter)
      .map(x => {
        return x.map(i => {
          let obj: { accessKeyId?: string; secretAccessKey?: string };
          if (i.includes("aws_access_key_id")) {
            obj.accessKeyId = i.replace(/.*aws_access_key_id\s*=\s*/, "");
          }
          if (i.includes("aws_secret_access_key")) {
            obj.secretAccessKey = i.replace(
              /.*aws_secret_access_key\s*=\s*/,
              ""
            );
          }
          return obj;
        });
      });
    // .pop()
    // .slice(1, 3);

    // const credentialsObj = {
    //   accessKeyId: "",
    //   secretAccessKey: ""
    // };
    // credentials.map(i => {
    //   if (i.includes("aws_access_key_id")) {
    //     credentialsObj.accessKeyId = i.replace(
    //       /.*aws_access_key_id\s*=\s*/,
    //       ""
    //     );
    //   }
    //   if (i.includes("aws_secret_access_key")) {
    //     credentialsObj.secretAccessKey = i.replace(
    //       /.*aws_secret_access_key\s*=\s*/,
    //       ""
    //     );

    return profile ? credentials[0] : credentials;
  } catch (e) {
    return false;
  }
}

function getAwsProfileInfo(profile: string) {}

/**
 * Asks the user to choose an AWS profile
 */
export async function askForAwsProfile(): Promise<string> {
  const profiles = await getAwsProfileList();
  const question: inquirer.Question = {
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
  const question: inquirer.Question = {
    type: "list",
    name: "region",
    message: "What AWS region do you want to target?",
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
    ],
    default: "us-east-1"
  };
  return;
}
