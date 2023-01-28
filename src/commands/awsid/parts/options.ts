import { OptionDefn } from "src/@types/option-types";

export const options: OptionDefn = {
  all: {
    alias: "a",
    type: Boolean,
    group: "local",
    description: "looks up the AWS account ID's for all profiles in the credentials file",
  },
};
