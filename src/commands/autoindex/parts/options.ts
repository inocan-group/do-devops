import chalk from "chalk";
import { IOptionDefinition } from "~/@types/option-types";

export interface IAutoindexOptions {
  config: boolean;
  add: string;
  glob: string;
  /**
   * boolean flag to indicate whether VueJS SFC files should have their default
   * export added to the index file.
   */
  sfc: boolean;
  /**
   * if set, will make all SFC files _asynchronous_ exports
   */
  async: boolean;
  dir: string;
  force: boolean;
  all: boolean;
  watch: boolean;
  preserveExtension: boolean;

  explicitFiles: boolean;
}

export const options: IOptionDefinition = {
  // argv
  explicitFiles: {
    defaultOption: true,
    multiple: true,
    type: String,
    group: "local",
    description: chalk`{italic optionally} state one or more explicit autoindex files to evaluate instead of glob patterns`,
    typeLabel: "string[]",
  },

  config: {
    type: Boolean,
    group: "local",
    description: `configure autoindex for a project`,
  },
  sfc: {
    type: Boolean,
    group: "local",
    description: chalk`by default VueJS SFC files will be extracted as a default import but this can be turned off with this flag`,
  },
  dir: {
    type: String,
    group: "local",
    description:
      'by default will look for files in the "src" directory but you can redirect this to a different directory',
  },
  watch: {
    alias: "w",
    type: Boolean,
    group: "local",
    description: chalk`watches for changes and runs {italic autoindex} when detected`,
  },
  force: {
    alias: "f",
    type: Boolean,
    group: "local",
    description:
      "forces a rebuild of all autoindex files even if the hash-code appears to be unchanged",
  },
  preserveExtension: {
    alias: "p",
    type: Boolean,
    group: "local",
    description: chalk`exports -- by default -- will {italic not} include the file's {blue .js} extension but sometimes with ES modules you want to include this. If you do then you should set this flag.`,
  },
};
