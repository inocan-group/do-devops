/* eslint-disable unicorn/no-process-exit */
import inquirer, { ListQuestion } from "inquirer";
import { askConfirmQuestion } from "src/shared/interactive";
import { getAwsProfileDictionary } from "./index";

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
  const profiles = await getAwsProfileDictionary();

  if (!profiles) {
    const cont = askConfirmQuestion(
      `Currently you don't have any AWS profiles (aka, profiles in src/.aws/credentials).\nWould you like to create one now?`
    );
    if (!cont) {
      console.log(`- no problem, try this command again when you're ready.\n`);
      process.exit();
    }
  }

  const defaultProfile = opts.defaultProfile ? profiles[opts.defaultProfile] : profiles[0];

  const question: ListQuestion = {
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
