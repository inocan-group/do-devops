import { IDoDevopsCommand } from "src/@types/command";
import { handler, description, options } from "./parts/index";

const command: IDoDevopsCommand = {
  kind: "awsid",
  handler,
  description,
  options,
};

export default command;
