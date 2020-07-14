import { IDictionary } from "common-types";
import * as subCommands from "../private/subCommands/index";
import chalk = require("chalk");

export interface IBitbucketHandler {
  handler: (opts: IDictionary) => Promise<0 | 1>;
}

export async function handler(argv: string[], opts: IDictionary): Promise<void> {
  const subCommand = argv[0];
  if (!Object.keys(subCommands).includes(subCommand)) {
    throw new Error(
      chalk`The subcommand "${subCommand}" is unknown to do's {bold bitbucket} command! Valid subcommands include:\n\n{grey ${Object.keys(
        subCommands
      ).join(", ")}}`
    );
  }

  const cmdDefn = (subCommands[subCommand as keyof typeof subCommands] as unknown) as IBitbucketHandler;

  process.exit(await cmdDefn.handler(opts));
}
