import chalk from "chalk";
import { IOptionDefinition } from "~/@types/option-types";

export interface IAutoindexOptions {
  add: string;
  glob: string;
  sfc: boolean;
  dir: string;
  all: boolean;
  watch: boolean;
  preserveExtension: boolean;
}

export const options: IOptionDefinition = {
  add: {
    type: String,
    group: "local",
    description:
      "adds additional files to include as possible autoindex sources; you can comma delimit to add more than one",
  },
  glob: {
    type: String,
    group: "local",
    description:
      'replaces the glob file matching pattern with your own (however "node_modules" still excluded)',
  },
  sfc: {
    type: Boolean,
    group: "local",
    description: chalk`allows switching on the inclusion of VueJS SFC files; when turned on it is an {italic additive} inclusion where the configured export type is respected but the SFC's are always default exports who's name is transformed to the component name.`,
  },
  dir: {
    type: String,
    group: "local",
    description:
      'by default will look for files in the "src" directory but you can redirect this to a different directory',
  },
  all: {
    alias: "a",
    type: Boolean,
    group: "local",
    description: chalk`this option can be used in monorepos to avoid the interactive dialog and always set the scope of autoindex to ALL packages`,
  },
  watch: {
    alias: "w",
    type: Boolean,
    group: "local",
    description: chalk`watches for changes and runs {italic autoindex} when detected`,
  },
  preserveExtension: {
    alias: "p",
    type: Boolean,
    group: "local",
    description: chalk`exports -- by default -- will {italic not} include the file's {blue .js} extension but sometimes with ES modules you want to include this. If you do then you should set this flag.`,
  },
};
