import { OptionDefinition } from "command-line-usage";
import chalk = require("chalk");

export const options: OptionDefinition[] = [
  {
    name: "add",
    type: String,
    group: "autoindex",
    description: "adds additional files to include as possible autoindex sources; you can comma delimit to add more than one",
  },
  {
    name: "glob",
    type: String,
    group: "autoindex",
    description: "replaces the glob file matching pattern with your own (however \"node_modules\" still excluded)",
  },
  {
    name: "sfc",
    type: Boolean,
    group: "autoindex",
    description: chalk`allows switching on the inclusion of VueJS SFC files; when turned on it is an {italic additive} inclusion where the configured export type is respected but the SFC's are always default exports who's name is transformed to the component name.`,
  },
  {
    name: "dir",
    type: String,
    group: "autoindex",
    description: "by default will look for files in the \"src\" directory but you can redirect this to a different directory",
  },
  {
    name: "quiet",
    alias: "q",
    type: Boolean,
    group: "autoindex",
    description: chalk`stops most output to {italic stdout}; changes are still output`,
  },
  {
    name: "all",
    alias: "a",
    type: Boolean,
    group: "autoindex",
    description: chalk`this option can be used in monorepos to avoid the interactive dialog and always set the scope of autoindex to ALL packages`,
  },
  {
    name: "watch",
    alias: "w",
    type: Boolean,
    group: "autoindex",
    description: chalk`watches for changes and runs {italic autoindex} when detected`,
  },
  {
    name: "preserveExtension",
    alias: "p",
    type: Boolean,
    group: "autoindex",
    description: chalk`exports -- by default -- will {italic not} include the file's {blue .js} extension but sometimes with ES modules you want to include this. If you do then you should set this flag.`,
  },
];
