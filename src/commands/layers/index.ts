import { Command } from "src/@types/command";
import { handler, description } from "./parts/index";

const command: Command = {
  kind: "layers",
  handler,
  description,
};

export default command;
