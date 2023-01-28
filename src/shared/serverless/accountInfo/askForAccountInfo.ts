/* eslint-disable unicorn/no-process-exit */
import { AWS_REGIONS, IPackageJson, IServerlessAccountInfo } from "common-types";

import inquirer, { ListQuestion, Question } from "inquirer";
import chalk from "chalk";
import {
  getAwsIdentityFromProfile,
  getAwsProfile,
  getAwsProfileDictionary,
  userHasAwsProfile,
} from "src/shared/aws";
import { emoji } from "src/shared/ui";
import { getServerlessYaml } from "src/shared/serverless";
import { getPackageJson } from "src/shared/npm";

/**
 * Allows the properties not yet defined in the configuration to be
 * interactively added.
 *
 * @param config the configuration as it has been defined so far
 */
export async function askForAccountInfo(
  config: Partial<IServerlessAccountInfo> = {}
): Promise<IServerlessAccountInfo> {
  const pkgJson = getPackageJson();
  const profiles = await getAwsProfileDictionary();

  if (
    config.profile &&
    config.name &&
    config.accountId &&
    config.region &&
    config.pluginsInstalled &&
    (config.logForwarding ||
      (pkgJson &&
        !Object.keys(pkgJson.devDependencies || {}).includes("serverless-log-forwarding")))
  ) {
    return config as IServerlessAccountInfo;
  }

  const baseProfileQuestion = {
    name: "profile",
    message: "Choose a profile from your AWS credentials file",
    default: config.profile,
    when: () => !config.profile,
  };
  const profileQuestion: Question | ListQuestion = profiles
    ? {
        ...baseProfileQuestion,

        type: "list",
        choices: Object.keys(profiles),
      }
    : { ...baseProfileQuestion, type: "input" };

  let questions: Array<Question | ListQuestion> = [
    {
      type: "input",
      name: "name",
      message: "What is the Service Name for this repo?",
      default: config.name || pkgJson ? (pkgJson as IPackageJson).name : undefined,
      when: () => !config.name,
    },
    profileQuestion,
  ];

  let answers: Partial<IServerlessAccountInfo> = await inquirer.prompt(questions);
  const merged = {
    ...config,
    ...answers,
  };

  if (merged.profile && !userHasAwsProfile(merged.profile)) {
    console.log(
      `- you are deploying with the {green ${merged.profile} AWS profile but you do not have this defined yet! ${emoji.angry}`
    );
    console.log(chalk.grey`- AWS profiles must be added in ${chalk.blue`src/.aws/credentials`}`);
    console.log(
      chalk.grey`- if you want to override the default behavior you can state a different profile with the ${chalk.blue`--profile`} tag`
    );
    process.exit();
  }

  if (!merged.profile) {
    console.log(`- you have not provided an AWS {bold profile}; exiting ...`);
    process.exit();
  }
  if (!(await userHasAwsProfile(merged.profile))) {
    console.log(
      `- you do {bold NOT} have the credentials for the profile ${chalk.blue(merged.profile)}! Please add this before\n  trying again. ${emoji.angry}\n`
    );
    console.log(chalk.grey`- the credentials file is located at ${chalk.blue`src/.aws/credentials`}\n`);

    process.exit();
  }

  const awsProfile = await getAwsProfile(merged.profile as string);

  if (merged.region) {
    config.region = awsProfile.region;
  }
  if (!merged.accountId) {
    console.log(`- looking up the Account ID for the given profile`);
    try {
      // eslint-disable-next-line unicorn/no-await-expression-member
      merged.accountId = (await getAwsIdentityFromProfile(awsProfile)).accountId;
    } catch {}
  }

  questions = [
    {
      type: "input",
      name: "accountId",
      message: "what is the Amazon Account ID which you are deploying to?",
      when: () => !merged.accountId,
    },
    {
      type: "list",
      name: "region",
      message: "what is the region you will be deploying to?",
      choices: AWS_REGIONS,
      default: merged.region || awsProfile.region || "us-east-1",
      when: () => !config.region,
    },
  ];
  let plugins: { pluginsInstalled: string[] };
  try {
    const sls = await getServerlessYaml();
    plugins = { pluginsInstalled: sls.plugins || [] };
  } catch {
    plugins = { pluginsInstalled: [] };
  }
  answers = {
    ...plugins,
    ...answers,
    ...(await inquirer.prompt(questions)),
  };

  return merged as IServerlessAccountInfo;
}
