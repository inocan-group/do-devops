import inquirer from "inquirer";

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
      "ap-southeast-2",
    ],
  };
  const answer = await inquirer.prompt(question);
  return answer.region;
}
