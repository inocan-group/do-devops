import { findHandlerConfig } from "../../ast/findHandlerConfig";
import { writeFile } from "fs";
import * as path from "path";
import { promisify } from "util";
import { IHandlerInfo } from "../getLocalHandlerInfo";
const write = promisify(writeFile);

/**
 * creates an enumeration with all of the _functions_ which have
 * been defined in the project
 */
export async function createFunctionEnum(handlers: IHandlerInfo[]) {
  const header = `export enum AvailableFunction {
`;
  const footer = `
}
  
export type IAvailableFunction = keyof typeof AvailableFunction;
`;
  let body: string[] = [];
  handlers.forEach(handler => {
    const config = findHandlerConfig(handler.source);
    const fn = handler.fn;
    const comment = config.config.description
      ? config.config.description
      : `${fn} handler`;
    body.push(
      `
  /**
   * ${comment}
   **/
  ${fn} = "${fn}"`
    );
  });
  const fileText = `${header}${body.join(",")}${footer}`;
  await write(
    path.resolve(path.join(process.cwd(), "/src/@types/functions.ts")),
    fileText,
    { encoding: "utf-8" }
  );
  return fileText;
}
