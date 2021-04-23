import * as commands from "~/commands/index";
import { IDoDevopsCommand, KnownCommand } from "~/@types/command";

/**
 * Pull off a specific _command's_ definition
 */
export function getCommand(cmd: KnownCommand): IDoDevopsCommand {
  // TODO: remove the forced typing once consistent
  return commands[cmd as keyof typeof commands] as IDoDevopsCommand;
}
