import chalk from "chalk";
import type { IDoDevopsCommand } from "~/@types";
import { IImageOptions, handler } from "./parts";

export interface IInfoOptions {
  allDeps?: boolean;
  listDeps?: boolean;
}

const command: IDoDevopsCommand<IImageOptions> = {
  kind: "image",
  handler,
  description:
    "Summarized information about the current repo; or alternatively a set of external npm packages (if stated).",
  syntax: chalk`dd image [ {italic list | optimize | config} ] [ {italic options} ]`,
  greedy: true,
  subCommands: [
    { name: "list", summary: "list all images in the current directory and below" },
    { name: "convert", summary: "optimize images based on the configuration" },
    { name: "config", summary: "configure the optimization for this repo" },
  ]
};

export default command;
