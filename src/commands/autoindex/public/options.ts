import { OptionDefinition } from "command-line-usage";

export const options: OptionDefinition[] = [
  {
    name: "add",
    type: String,
    group: "autoindex",
    description: `adds additional glob patterns to look for`,
  },
  {
    name: "glob",
    type: String,
    group: "autoindex",
    description: `replaces the glob file matching pattern with your own (however "node_modules" still excluded)`,
  },
  {
    name: "dir",
    type: String,
    group: "autoindex",
    description: `by default will look for files in the "src" directory but you can redirect this to a different directory`,
  },
];
