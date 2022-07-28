import { IDoDevopsCommand } from "src/@types/command";
import { askForAutoindexConfig } from "src/shared/interactive";
import { handler, description, options } from "./parts/index";

const command: IDoDevopsCommand = {
  kind: "autoindex",
  handler,
  description,
  options,
  config: askForAutoindexConfig,
};

export default command;
