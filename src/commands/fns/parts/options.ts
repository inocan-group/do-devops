import chalk from "chalk";
import { IOptionDefinition } from "~/@types/option-types";

export const options: IOptionDefinition = {
  forceBuild: {
    alias: "f",
    type: Boolean,
    group: "local",
    description: chalk`by default functions will be derived from {italic serverless.yml} but if you are in a {italic typescript-microservice} project you can force a rebuild prior to listing the functions`,
  },
  profile: {
    type: String,
    group: "local",
    description: "allows you to explicitly state the AWS profile to use for this command",
  },
  region: {
    type: String,
    group: "local",
    description: "allows you to explicitly state the AWS region to use for this command",
  },
  stage: {
    type: String,
    group: "local",
    description:
      "allows the results to be filtered down to only those functions associated with a given stage",
  },
};

export interface IFnsOptions {
  forceBuild: boolean;
  profile: string;
  region: string;
  stage: string;
}
