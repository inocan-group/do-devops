import { IDoDevopsCommand } from "~/@types/command";
import { handler, description, options } from "./parts/index";

const command: IDoDevopsCommand = {
  kind: "test",
  handler,
  description,
  options,
  greedy: true,
};

export default command;
