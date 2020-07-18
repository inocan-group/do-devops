import { ICommandDescription } from "../../../private";

export const commands: ICommandDescription[] = [
  {
    name: "list",
    summary: "lists the SSM secrets for a given profile and region",
  },
  { name: "get", summary: "get details on a specific secret" },
  { name: "set", summary: "set the value for a given secret" },
];
