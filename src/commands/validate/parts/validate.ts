import chalk from "chalk";
import { IDictionary } from "common-types";
import { getCurrentGitBranch } from "~/shared/git";
import * as subCommands from "../private/subCommands/index";
import { includedIn } from "../private/index";
import { DoDevopsHandler } from "~/@types/command";
import { IValidateOptions } from "./validate-meta";

export type ValidationAction = "none" | "warn" | "error";
export interface IValidationHandler {
  handler: (
    action: ValidationAction,
    currentBranch: string,
    options?: IDictionary
  ) => Promise<0 | 1>;
}

/**
 * Validate a set of known sub-commands and return
 */
export const handler: DoDevopsHandler<IValidateOptions> = async ({ argv, opts }) => {
  const subCommand = argv[0];
  if (!Object.keys(subCommands).includes(subCommand)) {
    throw new Error(
      chalk`The subcommand "${subCommand}" is unknown to {bold validate}! Valid subcommands include:\n\n{grey ${Object.keys(
        subCommands
      ).join(", ")}}`
    );
  }
  const defaultAction = opts.default ? (opts.default as ValidationAction) : "none";
  const warnBranches: string[] = opts.warn ? opts.warn.split(",") : [];
  const errorBranches: string[] = opts.error ? opts.error.split(",") : [];
  const currentBranch: string = await getCurrentGitBranch();

  const action = includedIn(currentBranch, errorBranches)
    ? "error"
    : includedIn(currentBranch, warnBranches)
    ? "warn"
    : defaultAction;

  if (action !== "none") {
    const cmdDefn = (subCommands[
      subCommand as keyof typeof subCommands
    ] as unknown) as IValidationHandler;
    process.exit(await cmdDefn.handler(action, currentBranch, opts));
  }

  process.exit();
};
