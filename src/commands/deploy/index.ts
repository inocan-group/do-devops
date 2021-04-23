import { IDoDevopsCommand } from "~/@types/command";
import { handler, description, options } from "./parts";

const command: IDoDevopsCommand = {
  kind: "deploy",
  handler,
  description,
  options,
};

export default command;
