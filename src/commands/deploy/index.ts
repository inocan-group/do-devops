import { Command } from "src/@types/command";
import { handler, description, options } from "./parts";

const command: Command = {
  kind: "deploy",
  handler,
  description,
  options,
};

export default command;
