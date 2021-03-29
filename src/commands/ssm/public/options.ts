import { OptionDefinition } from "command-line-usage";
import chalk = require("chalk");

export const options: OptionDefinition[] = [
  {
    name: "profile",
    type: String,
    typeLabel: "<profileName>",
    group: "ssm",
    description: `set the AWS profile explicitly`,
  },
  {
    name: "region",
    type: String,
    typeLabel: "<region>",
    group: "ssm",
    description: `set the AWS region explicitly`,
  },
  {
    name: "stage",
    type: String,
    typeLabel: "<stage>",
    group: "ssm",
    description: `set the stage explicitly`,
  },
  {
    name: "nonStandardPath",
    type: Boolean,
    group: "ssm",
    description:
      "allows the naming convention for SSM paths to be ignored for a given operation",
  },
  {
    name: "force",
    alias: "f",
    type: Boolean,
    group: "ssm",
    description: chalk`force a {italic set} operation to complete even when the variable being set alread exists`,
  },
  {
    name: "base64",
    type: Boolean,
    group: "ssm",
    description: chalk`adding this flag will encode with base64 when adding and decode from base64 to utf-8 when getting`,
  },
  {
    name: "quiet",
    alias: "q",
    type: Boolean,
    group: "ssm",
    description:
      "allows the naming convention for SSM paths to be ignored for a given operation",
  },
];
