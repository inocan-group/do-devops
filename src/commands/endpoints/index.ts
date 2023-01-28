import { Command } from "src/@types/command";
import { handler, description, options } from "./parts";

const command: Command = {
  kind: "endpoints",
  handler,
  description,
  options,
};

export default command;
