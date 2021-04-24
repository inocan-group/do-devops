import chalk from "chalk";
import { IOptionDefinition } from "~/@types/option-types";

export const options: IOptionDefinition = {
  subCommand: {
    type: String,
    defaultValue: true,
    group: "local",
    description: "The SSM command -- list, get, set -- which you want to execute",
  },
  profile: {
    type: String,
    typeLabel: "<profileName>",
    group: "local",
    description: "set the AWS profile explicitly",
  },
  region: {
    type: String,
    typeLabel: "<region>",
    group: "local",
    description: "set the AWS region explicitly",
  },
  stage: {
    type: String,
    typeLabel: "<stage>",
    group: "local",
    description: "set the stage explicitly",
  },
  nonStandardPath: {
    type: Boolean,
    group: "local",
    description:
      "allows the naming convention for SSM paths to be ignored for a given operation",
  },
  description: {
    type: String,
    group: "local",
    description: "sets the description of the SSM variable (only used in ADD)",
  },
  force: {
    alias: "f",
    type: Boolean,
    group: "local",
    description: chalk`force a {italic set} operation to complete even when the variable being set alread exists`,
  },
  base64: {
    type: Boolean,
    group: "local",
    description: chalk`adding this flag will encode with base64 when adding and decode from base64 to utf-8 when getting`,
  },
};

export interface ISsmOptions {
  profile: string;
  region: string;
  stage: string;
  nonStandardPath: boolean;
  description: string;
  force: boolean;
  base64: boolean;
}
