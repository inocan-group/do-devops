import { OptionDefinition } from "command-line-usage";

export const options: OptionDefinition[] = [
  {
    name: "force",
    type: Boolean,
    group: "build",
    description: "forces the transpiling of code when building a serverless project",
  },
  {
    name: "interactive",
    alias: "i",
    type: Boolean,
    group: "build",
    description: "allows choosing the functions interactively",
  },
];
