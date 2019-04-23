import { IDictionary } from "common-types";

export interface IDoHandler {
  handler(argv: string[], options?: IDictionary);
}
