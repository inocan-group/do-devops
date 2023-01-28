import commandLineArgs from "command-line-args";
import {   OptionDefn } from "src/@types";
import {  Command, CommandInput, KnownCommand } from "src/@types/command";
import { convertOptionsToArray, globalOptions, ILogger, logger } from "./index";

/**
 * Given a known command to the CLI, this function will
 * parse the command line arguments to arrive at both
 * an `argv` array and `opts` hash to be passed to the
 * command.
 */
export function parseCmdArgs<
  TCmd extends Command
>(
  cmd: TCmd, 
  incomingArgv: string[]
): CommandInput<TCmd["kind"] & KnownCommand, TCmd["options"]> {
  // to ensure that what we'd see as "argv" from the perspective of a
  // command, we must build an "option" for it
  const subCommandDefn: OptionDefn = {
    command: {
        type: String,
        group: "subCommand",
        defaultOption: true
      ,
      ...(cmd.greedy ? { multiple: true } : {}),
    },
  };

  const greedyCommandDefn: OptionDefn = {
    argv: {
      type: String,
      group: "argv",
      defaultOption: true,
      multiple: true,
    },
  };

  // we will then combine this with global options and as well as pickup the sub command
  // if the command defines sub-commands
  const optDefn = cmd.subCommands
    ? { ...globalOptions, ...subCommandDefn, ...cmd.options }
    : { ...globalOptions, ...cmd.options, ...(cmd.greedy ? greedyCommandDefn : {}) };

  // the options will be parsed into `local`, `global`, and `argv` categories
  // in a few cases there may also be `l2` and then anything which is not
  // known about will be dropped into `_unknown`.
  const { global, local, _unknown, subCommand, argv } = commandLineArgs(
    convertOptionsToArray(optDefn),
    {
      argv: incomingArgv,
      partial: true,
    }
  );

  // combine "local" and "global" options
  const opts = { ...global, ...local };

  const sc: string | undefined = subCommand 
    ? (cmd.greedy 
        ? subCommand?.command[0] 
        : subCommand?.command
      ) 
    : undefined;

  return {
    subCommand: sc,
    argv: (
      cmd.greedy 
      ? (sc ? sc?.slice(1) || [] 
      : argv.argv || []) : []
    ) as string[],
    raw: incomingArgv,
    opts,
    optConfig: cmd.config,
    unknown: _unknown || [],
    log: logger(opts) as ILogger
  } as unknown as CommandInput<TCmd["kind"] & KnownCommand, TCmd["options"]>; 
}
