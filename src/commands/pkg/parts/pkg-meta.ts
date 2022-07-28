import chalk from "chalk";
import { IOptionDefinition } from "src/@types/option-types";

export const description = chalk`Package up resources for {bold Serverless} publishing but do not actually {italic deploy}.`;

export const options: IOptionDefinition = {
  stage: {
    type: String,
    typeLabel: "<stage>",
    group: "local",
    description: "the AWS stage which is being targetted",
  },
  profile: {
    type: String,
    typeLabel: "<profile>",
    group: "local",
    description: "The AWS credential profile being used for this CLI command",
  },
  region: {
    type: String,
    typeLabel: "<region>",
    group: "local",
    description: "The AWS region being used for this CLI command",
  },
  dir: {
    alias: "d",
    type: String,
    typeLabel: "<directory>",
    group: "local",
    description: chalk`by default assets are saved to the {italic .serverless} directory but you can change this to a different directory if you like.`,
  },
  validate: {
    type: Boolean,
    group: "local",
    description: chalk`after the package is completed the {bold cloudformation} template can be validated`,
  },
};

export type IPkgOptions = {
  stage: string;
  profile: string;
  region: string;
  dir: string;
  validate: boolean;
};

export const syntax = "dd pkg <options>";
export const aliases = ["package"];
