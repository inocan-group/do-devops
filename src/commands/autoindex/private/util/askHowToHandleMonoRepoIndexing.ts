import inquirer, { ListQuestion } from "inquirer";

export async function askHowToHandleMonoRepoIndexing(pkgs: string[]) {
  const choices = ["ALL", ...pkgs];
  const message =
    "This repo appears to be a monorepo. Please choose\nwhich repo(s) you want to run autoindex on:";

  const question: ListQuestion = {
    message,
    type: "list",
    name: "repo",
    choices,
    default: "ALL",
  };

  // eslint-disable-next-line unicorn/no-await-expression-member
  return (await inquirer.prompt(question)).repo;
}
