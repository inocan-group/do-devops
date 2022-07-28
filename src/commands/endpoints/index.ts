import { IDoDevopsCommand } from "src/@types/command";
import { handler, description, options } from "./parts";

const command: IDoDevopsCommand = {
  kind: "endpoints",
  handler,
  description,
  options,
};

export default command;
