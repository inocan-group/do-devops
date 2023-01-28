import { Command } from "src/@types/command";
import { handler, description, options } from "./parts/index";

const command: Command = {
  kind: "scaffold",
  handler,
  description,
  options,
};

export default command;
