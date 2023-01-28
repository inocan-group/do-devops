import { ICommandDescription } from "src/@types";
import { Command } from "src/@types/command";
import { handler, description, options } from "./parts";

const subCommands: ICommandDescription[] = [
  { name: "ssh", summary: "create a new SSH certificate" },
  { name: "ssl", summary: "create a new SSL certificate" },
  { name: "ca", summary: "create a Cert Authority locally" },
  { name: "info", summary: "info on a cert" },
];

const command: Command = {
  kind: "cert",
  handler,
  description,
  options,
  subCommands,
};

export default command;
