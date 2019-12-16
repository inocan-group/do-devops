import { getPackageJson } from "../../npm";
import { getServerlessYaml } from "..";
import inquirer = require("inquirer");
import { getAwsProfile, getAwsUserProfile, getAwsProfileList } from "../../aws";
import { IServerlessAccountInfo } from "../../../@types";
import { IDictionary } from "common-types";

export async function askForAccountInfo(
  defaults: Partial<IServerlessAccountInfo> = {}
): Promise<IServerlessAccountInfo> {
  const pkgJson = await getPackageJson();
  const profiles = await getAwsProfileList();
  const profileMessage = "choose a profile from your AWS credentials file";

  if (
    defaults.profile &&
    defaults.name &&
    defaults.accountId &&
    defaults.region &&
    defaults.pluginsInstalled &&
    (defaults.logForwarding ||
      !Object.keys(pkgJson.devDependencies).includes(
        "serverless-log-forwarding"
      ))
  ) {
    return defaults as IServerlessAccountInfo;
  }

  const baseProfileQuestion = {
    name: "profile",
    message: "Choose a profile from your AWS credentials file",
    default: defaults.profile,
    when: () => !defaults.profile
  };
  const profileQuestion: inquirer.Question | inquirer.ListQuestion = profiles
    ? {
        ...baseProfileQuestion,
        ...{
          type: "list",
          choices: Object.keys(profiles)
        }
      }
    : { ...baseProfileQuestion, ...{ type: "input" } };

  let questions: Array<inquirer.Question | inquirer.ListQuestion> = [
    {
      type: "input",
      name: "name",
      message:
        "What is the service name which your functions will be prefixed with",
      default: defaults.name || pkgJson.name,
      when: () => !defaults.name
    },
    profileQuestion
  ];

  let answers: Partial<IServerlessAccountInfo> = await inquirer.prompt(
    questions
  );
  const awsProfile = await getAwsProfile(answers.profile as string);
  const userProfile =
    awsProfile && awsProfile.aws_secret_access_key
      ? await getAwsUserProfile(awsProfile)
      : undefined;
  const accountId = userProfile
    ? userProfile.User.Arn.replace(/arn:aws:iam::([0-9]+):.*/, "$1")
    : undefined;

  questions = [
    {
      type: "input",
      name: "accountId",
      message: "what is the Amazon Account ID which you are deploying to?",
      default: accountId,
      when: () => !defaults.accountId
    },
    {
      type: "list",
      name: "region",
      message: "what is the region you will be deploying to?",
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
      default: defaults.region || awsProfile.region || "us-east-1",
      when: () => !defaults.region
    }
  ];
  let plugins: { pluginsInstalled: string[] };
  try {
    const sls = await getServerlessYaml();
    plugins = { pluginsInstalled: sls.plugins };
  } catch (e) {
    plugins = { pluginsInstalled: [] };
  }
  answers = {
    ...plugins,
    ...answers,
    ...(await inquirer.prompt(questions))
  };

  return answers as IServerlessAccountInfo;
}
