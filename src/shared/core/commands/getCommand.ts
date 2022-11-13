import { CommandDefinitions, IDoDevopsCommand, isDoDevopsCommand, KnownCommand } from "src/@types";
import { DevopsError } from "src/errors";
import commands from "src/commands";

/**
 * Pull off a specific _command's_ definition from a
 * subdirectory of `src/commands`.
 */
export function getCommand<C extends KnownCommand>(
  cmd: C
): IDoDevopsCommand<CommandDefinitions[C]> {
  const defn = commands[cmd as keyof typeof commands];

  if (!isDoDevopsCommand(defn)) {
    throw new DevopsError(
      `The command "${cmd}" is not defined correctly! Make sure all commands export a valid 'IDoDevopsCommand' interface.`,
      "do-devops/invalid-command-definition"
    );
  }
  return commands[cmd as keyof typeof commands] as unknown as IDoDevopsCommand;
}
