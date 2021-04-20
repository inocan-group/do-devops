import { OptionDefinition } from "command-line-usage";

export const options: OptionDefinition[] = [
  {
    name: "all",
    alias: "a",
    type: Boolean,
    group: "awsid",
    description: "looks up the AWS account ID's for all profiles in the credentials file",
  },
];
