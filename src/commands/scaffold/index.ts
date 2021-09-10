import { IDoDevopsCommand } from "~/@types/command";
import { handler, description, options } from "./parts/index";

const command: IDoDevopsCommand = {
  kind: "scaffold",
  handler,
  description,
  options,
};

export default command;
