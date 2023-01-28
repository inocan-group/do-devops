import { OptionDefn } from "src/@types/option-types";

export const options: OptionDefn = {
  repo: {
    alias: "r",
    type: String,
    group: "local",
    description: `by default the "latest" command works off the current working dirs repo but you can specify a foreign npm repo and get the latest of that repo`,
  },
};
