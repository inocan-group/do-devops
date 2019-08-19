import { inverted } from "../../shared";

export const DoSsmOptions = [
  {
    name: "profile",
    alias: "p",
    type: String,
    group: "ssm",
    description:
      "explicitly state the AWS profile to use (otherwise assumes value in current repos 'serverless.yml')",
    typeLabel: "<name>"
  },
  {
    name: "region",
    alias: "r",
    type: String,
    group: "ssm",
    description:
      "explicitly state the AWS region (note: this overrides profile if set)",
    typeLabel: "<region>"
  },
  {
    name: "output",
    alias: "o",
    type: String,
    group: "ssm",
    description: "sends output to the filename specified",
    typeLabel: "<filename>"
  },
  {
    name: "nonStandardPath",
    type: Boolean,
    group: "ssm",
    description:
      "allows the naming convention for SSM paths to be ignored for a given operation"
  },
  {
    name: "help",
    alias: "h",
    type: Boolean,
    group: "ssm",
    description: `shows help for the ${inverted(
      " ssm "
    )} command in general but also the specifics of a particular sub-command if stated`
  }
];
