import chalk from "chalk";

import { DevopsError } from "../errors/index";
import { getAwsProfileList } from "./index";
import inquirer = require("inquirer");

export interface IAskForProfileOptions {
  /**
   * optionally state a particular profile name to be the default; if not stated
   * or not found then the first profile in the `credentials` file will be used.
   */
  defaultProfile?: string;
  /**
   * by default it will return an error to the caller but if you prefer it can
   * simply exit the process with an error message to the console.
   */
  exitOnError?: boolean;
}

/**
 * Asks the user to choose an AWS profile
 */
export async function askForAwsProfile(opts?: IAskForProfileOptions): Promise<string> {
  opts = opts ? { exitOnError: false, ...opts } : { exitOnError: false };
  const profiles = await getAwsProfileList();
  const profileNames = Object.keys(profiles);
  if (!profiles) {
    const message = `Attempt to "ask" for the AWS profile assumes there is at least one defined AWS profile in the credentials file but that could not be found.`;

    if (opts.exitOnError) {
      console.log(chalk`{red - Missing AWS credentials file}`);
      console.log(message + "\n");
      process.exit();
    }

    throw new DevopsError(message, "devops/not-allowed");
  }

  const defaultProfile = opts.defaultProfile
    ? profiles[opts.defaultProfile] || profiles[profileNames[0]]
    : profiles[profileNames[0]];

  const question: inquirer.ListQuestion = {
    name: "profile",
    type: "list",
    choices: Object.keys(profiles),
    message: "choose a profile from your AWS credentials file",
    default: defaultProfile,
    when: () => true,
  };

  const answer = await inquirer.prompt(question);

  return answer.profile;
}
