import { IDoDevopsCommand } from "src/@types/command";
import { handler, description, options } from "./parts";

const command: IDoDevopsCommand = {
  kind: "fns",
  handler,
  description,
  options,
};

export default command;
