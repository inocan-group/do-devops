import { keys } from "inferred-types";
import { KnownCommand } from "src/@types";
import commands from "src/commands";

export const isKnownCommand = (cmd: unknown): cmd is KnownCommand => {
  return typeof cmd === "string" && keys(commands).includes(cmd as any);
};
