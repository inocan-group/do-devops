import { getCommands } from "./index";

export function isKnownCommand(cmd: string) {
  return getCommands().includes(cmd);
}
