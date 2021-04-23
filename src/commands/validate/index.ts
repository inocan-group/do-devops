import { IDoDevopsCommand } from "~/@types/command";
import { handler, description, options } from "./parts/index";

const command: IDoDevopsCommand = {
  kind: "validate",
  handler,
  description,
  options,
};

export default command;
