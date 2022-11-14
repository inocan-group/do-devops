import chalk from "chalk";
import { IOptionDefinition } from "src/@types";

export interface IMadgeOptions {
  /** circular command */
  circular: boolean;
  /** orphans command */
  orphans: boolean;
  /** leaves command */
  leaves: boolean;
  /** summary command */
  summary: boolean;
  /** JSON output */
  json: boolean;
  /** output an image instead of console output */
  image: string;
  /** choose a image layout option from dot, neato, fdp, sfdp, twopi, circo */
  layout: string;
  /** include first level npm dependencies; default is false */
  "include-npm": boolean;
  /** what file extensions to look for; default is "js,ts" */
  extensions: string;
}

export const options: IOptionDefinition = {
  circular: {
    type: Boolean,
    alias: "c",
    group: "local",
    description: `Madge's {bold {italic circular}} circular reference checker`,
  },
  orphans: {
    type: Boolean,
    alias: "o",
    group: "local",
    description: `Madge's {bold {italic orphans}} checker which shows which modules no one is depending on`,
  },
  leaves: {
    type: Boolean,
    alias: "l",
    group: "local",
    description: `Madge's {bold {italic leaves}} checker which shows modules with no dependencies`,
  },
  summary: {
    type: Boolean,
    alias: "s",
    group: "local",
    description: "Madge's {bold {italic summary}} command which provides an overview to repo",
  },
  json: {
    type: Boolean,
    alias: "j",
    group: "local",
    description: "output as JSON",
  },
  image: {
    type: String,
    alias: "i",
    group: "local",
    description: "write graph to file as an image",
  },
  layout: {
    type: String,
    group: "local",
    description: `layout engine for graph; choices are: {dim {italic dot, neato, fdp, sfdp, twopi, circo}}`,
  },

  "include-npm": {
    type: Boolean,
    group: "local",
    description: "include shallow NPM modules (default: false)",
  },

  extensions: {
    type: String,
    group: "local",
    description: `comma separated string of valid file extensions (uses {bold {italic js,ts}} as a default)`,
  },
};
