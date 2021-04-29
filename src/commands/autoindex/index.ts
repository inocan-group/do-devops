import { IDoDevopsCommand } from "~/@types/command";
import { handler, description, options } from "./parts/index";

const command: IDoDevopsCommand = {
  kind: "autoindex",
  handler,
  description,
  options,
};

export default command;
