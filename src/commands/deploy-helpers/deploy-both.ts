import * as chalk from "chalk";
import inquirer = require("inquirer");

export default async function deployBoth() {
  console.log(chalk`- This repo appears to be {italic both} a {bold Serverless} and an {bold NPM} project.`);
  console.log(chalk`- In the future you can use the {blue --target [ {dim serverless,npm} ]} switch to be explicit.`);

  console.log();
  const question: inquirer.Question | inquirer.ListQuestion = {
    type: "list",
    name: "type",
    message: chalk`Choose the {italic type} of build you want:`,
    choices: ["serverless", "npm"],
    default: "serverless",
  };
  const answer = await inquirer.prompt(question);
  return answer.type;
}
