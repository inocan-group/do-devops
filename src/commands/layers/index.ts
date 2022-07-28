import { IDoDevopsCommand } from "src/@types/command";
import { handler, description } from "./parts/index";

const command: IDoDevopsCommand = {
  kind: "layers",
  handler,
  description,
};

export default command;
