import { IDoDevopsCommand } from "~/@types/command";
import { handler, description, options, subCommands } from "./parts";

const command: IDoDevopsCommand = {
  kind: "ssm",
  handler,
  description,
  options,
  subCommands,
};

export default command;
