import chalk from "chalk";

const otherFramework = async (_args: string[]) => {
  console.log(
    chalk`- Your default framework for unit testing is set to {bold other} which do-devops doesn't know how to work with.`
  );
};

export default otherFramework;
