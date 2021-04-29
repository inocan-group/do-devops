import { IDoDevopsCommand } from "~/@types/command";
import { handler, description, options } from "./info";

const command: IDoDevopsCommand = {
  kind: "info",
  handler,
  description,
  options,
};

export default command;
