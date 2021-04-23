import chalk from "chalk";
import { IOptionDefinition } from "~/@types/option-types";

export const description =
  "Provides a set of devops validations that are well suited for Git hooks or a CI/CD pipeline.";

export const options: IOptionDefinition = {
  default: {
    type: String,
    description: "the default action type for all branches [none, warn, error]",
    group: "local",
  },
  error: {
    type: String,
    description: chalk`the {italic branches} which should be moved to {bold 'error'} status; you can comma-delimit for more than one`,
    group: "local",
  },
  warn: {
    type: String,
    description: chalk`the {italic branches} which should be moved to {bold 'warn'} status; you can comma-delimit for more than one`,
    group: "local",
  },
};

export interface IValidateOptions {
  default: string;
  error: string;
  warn: string;
}
