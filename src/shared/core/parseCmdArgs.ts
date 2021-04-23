import commandLineArgs from "command-line-args";
import { ICommandInput, IDoDevopsCommand } from "~/@types/command";
import { IOptionDefinition } from "~/@types/option-types";
import { convertOptionsToArray, globalOptions } from "./index";

/**
 * Given a known command to the CLI, this function will
 * parse the command line arguments to arrive at both
 * an `argv` array and `opts` hash to be passed to the
 * command.
 */
export function parseCmdArgs(cmd: IDoDevopsCommand) {
  // to ensure that what we'd see as "argv" from the perspective of a
  // command, we must build an "optoin" for it
  const argvOpt: IOptionDefinition = {
    argv: {
      type: String,
      group: "args",
      multiple: true,
      defaultOption: true,
    },
  };
  // we will then combine this with global options and anything the command is providing
  const optDefn = cmd.options
    ? { ...globalOptions, ...argvOpt, ...cmd.options }
    : { ...globalOptions, ...argvOpt };

  console.log({
    optDefn,
    cla: typeof commandLineArgs,
    cota: typeof convertOptionsToArray,
  });

  // the options will be parsed into `local`, `global`, and `argv` categories
  // in a few cases there may also be `l2` and then anything which is not
  // known about will be dropped into `_unknown`.
  const { global, local, argv, _unknown } = commandLineArgs(
    convertOptionsToArray(optDefn),
    {
      partial: true,
    }
  );

  const opts = { ...(global ? global : {}), ...(local ? local : {}) };

  // TODO: try to derive the generic type to get better results for commands
  return {
    argv: argv?.args || [],
    opts,
    unknown: _unknown,
  } as Omit<ICommandInput<typeof opts>, "observations">;
}
