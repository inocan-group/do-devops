import chalk from "chalk";

const jest = async (_args: any) => {
  console.log(
    chalk`- Your default framework for unit testing is set to {bold other} which do-devops doesn't know how to work with.`
  );
};
export default jest;
