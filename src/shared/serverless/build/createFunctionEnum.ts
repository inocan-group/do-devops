import path from "node:path";

import { existsSync, mkdirSync, writeFile } from "node:fs";

import { emoji } from "../../ui";
import { findHandlerConfig } from "../../ast/findHandlerConfig";
import { promisify } from "node:util";
import { IWebpackHandlerDates } from "src/@types";
import chalk from "chalk";

const write = promisify(writeFile);

/**
 * creates an enumeration with all of the _functions_ which have
 * been defined in the project
 */
export async function createFunctionEnum(handlers: IWebpackHandlerDates[]) {
  const header = `export enum AvailableFunction {
`;
  const footer = `
}
  
export type IAvailableFunction = keyof typeof AvailableFunction;
`;
  const body: string[] = [];
  for (const handler of handlers) {
    const config = findHandlerConfig(handler.source);
    if (config) {
      const fn = handler.fn;
      const comment = config.config.description ?? `${fn} handler`;
      body.push(
        `
  /**
   * ${comment}
   **/
  ${fn} = "${fn}"`
      );
    } else {
      console.log(
        `- ${emoji.angry} also excluding the ${chalk.italic(handler.source
          .split("/")
          .pop())} in the generated enumeration of handlers`
      );
    }
  }

  const fileText = `${header}${body.join(",")}${footer}`;
  if (!existsSync(path.join(process.cwd(), "/src/@types"))) {
    mkdirSync(path.join(process.cwd(), "/src/@types"));
  }

  await write(path.resolve(path.join(process.cwd(), "/src/@types/functions.ts")), fileText, {
    encoding: "utf8",
  });
  return fileText;
}
