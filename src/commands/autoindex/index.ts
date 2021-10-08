import { IDoDevopsCommand } from "~/@types/command";
import { askForAutoindexConfig } from "~/shared/interactive";
import { handler, description, options } from "./parts/index";

const command: IDoDevopsCommand = {
  kind: "autoindex",
  handler,
  description,
  options,
  config: askForAutoindexConfig,
};

export default command;
