import {
  findInlineFunctionDefnFiles,
  findConfigFunctionDefnFiles
} from "../shared";
import { IDictionary } from "common-types";

export async function handler(args: string[], opt: IDictionary) {
  const inlineFns = await findInlineFunctionDefnFiles();
  const configFiles = await findConfigFunctionDefnFiles();
  console.log(inlineFns);
  console.log(configFiles);
}
