import chalk from "chalk";
import { IOptionDefinition } from "~/@types/option-types";

export const options: IOptionDefinition = {
  forceBuild: {
    alias: "f",
    type: Boolean,
    group: "local",
    description: chalk`by default functions will be derived from {italic serverless.yml} but if you are in a {italic typescript-microservice} project you can force a rebuild prior to listing the functions`,
  },
};
