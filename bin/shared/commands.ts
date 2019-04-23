import * as subCommands from "../commands";

export function commands() {
  return Object.keys(subCommands).filter(i => i !== "help");
}
