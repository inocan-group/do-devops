import inquirer from "inquirer";

export async function askHowToHandleMonoRepoIndexing(pkgs: string[]) {
  const choices = ["ALL", ...pkgs];
  const message =
    "This repo appears to be a monorepo. Please choose\nwhich repo(s) you want to run autoindex on:";

  const question: inquirer.ListQuestion = {
    message,
    type: "list",
    name: "repo",
    choices,
    default: "ALL",
  };

  return (await inquirer.prompt(question)).repo;
}
