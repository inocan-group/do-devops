import * as chalk from "chalk";
import * as path from "path";

import { IHandlerInfo } from "../getLocalHandlerInfo";
import { emoji } from "../../ui";
import { findHandlerConfig } from "../../ast/findHandlerConfig";
import { promisify } from "util";
import { writeFile } from "fs";
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
  handlers.forEach((handler) => {
    const config = findHandlerConfig(handler.source);
    if (!config) {
      console.log(
        chalk`- ${emoji.angry} also excluding the {italic ${handler.source
          .split("/")
          .pop()}} in the generated enumeration of handlers`
      );
    } else {
      const fn = handler.fn;
      const comment = config.config.description ? config.config.description : `${fn} handler`;
      body.push(
        `
  /**
   * ${comment}
   **/
  ${fn} = "${fn}"`
      );
    }
  });

  const fileText = `${header}${body.join(",")}${footer}`;
  await write(path.resolve(path.join(process.cwd(), "/src/@types/functions.ts")), fileText, { encoding: "utf-8" });
  return fileText;
}
