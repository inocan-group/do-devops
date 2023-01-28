import { Command } from "src/@types/command";
import { handler, description, options, subCommands } from "./parts";

const command: Command = {
  kind: "ssm",
  handler,
  description,
  options,
  subCommands,
};

export default command;
