import { ICommandDescription } from "~/@types";

export const subCommands: ICommandDescription[] = [
  { name: "list", summary: "list all SSM secrets in a given AWS profile" },
  { name: "get", summary: "get the details for a particular SSM secret" },
  { name: "set", summary: "set/add a SSM secret" },
];
