import { ICommandDescription } from "~/@types";
import { IDoDevopsCommand } from "~/@types/command";
import { handler, description, options } from "./parts";

const subCommands: ICommandDescription[] = [
  { name: "ssh", summary: "create a new SSH certificate" },
  { name: "ssl", summary: "create a new SSL certificate" },
  { name: "ca", summary: "create a Cert Authority locally" },
  { name: "info", summary: "info on a cert" },
];

const command: IDoDevopsCommand = {
  kind: "cert",
  handler,
  description,
  options,
  subCommands,
};

export default command;
