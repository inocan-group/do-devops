import chalk from "chalk";
import * as path from "path";

import { IDictionary, IServerlessFunction } from "common-types";
import { relativePath, stripFileExtension } from "../../file";

import { IHandlerInfo } from "../getLocalHandlerInfo";
import { emoji } from "../../ui";
import { findHandlerConfig } from "../../ast/index";
import { getConfig } from "../../do-config";
import { hasDevDependency } from "../../npm";
import { join } from "path";
import { writeFileSync } from "fs";

export interface IInlineExportConfig {
  interface: string;
  config: IServerlessFunction;
}

/**
 * Writes the serverless configuration file which contains
 * all the _inline_ function definitions found under `src/handlers`.
 *
 * **Note:** if the build tool is _webpack_ and the `serverless-webpack`
 * plugin is _not_ installed then it the inline functions will instead
 * be pointed to the transpiled location in the `.webpack` directory with
 * an `package: { artifact: fn.zip }`
 */
export async function createInlineExports(handlers: IHandlerInfo[]) {
  const bespokeWebpack =
    (await getConfig()).build.buildTool === "webpack" && !hasDevDependency("serverless-webpack");

  const header = 'import { IServerlessFunction } from "common-types";\n';
  let body: string[] = [];
  const config: IInlineExportConfig[] = [];
  handlers.forEach((handler) => {
    // const comments = findHandlerComments(handler);
    const handlerConfig = findHandlerConfig(handler.source, bespokeWebpack);
    if (handlerConfig) {
      config.push(handlerConfig);
    } else {
      console.log(
        chalk`- ${emoji.poop} the {red ${relativePath(
          handler.source
        )}} file will be ignored as a handler as it has no CONFIG section defined. This is probably a mistake!`
      );
    }
  });
  const exportSymbols: string[] = [];

  warnAboutMissingTyping(config);

  config.forEach((handler) => {
    const fnName = handler.config.handler
      .split("/")
      .pop()
      .replace(/\.[^.]+$/, "");

    exportSymbols.push(fnName);
    const symbol = `const ${fnName}: IServerlessFunction = { 
${objectPrint(handler.config)}
}
`;
    body.push(symbol);
  });
  const file: string = `
${header}
${body.join("\n")}

export default {
  ${exportSymbols.join(",\n\t")}
}`;

  writeFileSync(path.join(process.env.PWD, "serverless-config/functions/inline.ts"), file, {
    encoding: "utf-8",
  });
}

function objectPrint(obj: IDictionary) {
  let contents: string[] = [];
  Object.keys(obj).forEach((key) => {
    let value = obj[key as keyof typeof obj];
    if (typeof value === "string") {
      value = `"${value.replace(/"/g, '\\"')}"`;
    }
    if (typeof value === "object") {
      value = JSON.stringify(value);
    }
    contents.push(`  ${key}: ${value}`);
    return contents.join(",\n\t");
  });

  return contents;
}

function convertToWebpackResource(fn: string) {
  return join(".webpack/", fn.split("/").pop().replace(".ts", ".js"));
}

function warnAboutMissingTyping(config: IInlineExportConfig[]) {
  const incorrectOrMissingTyping = config.filter((i) => i.interface !== "IWrapperFunction");
  if (incorrectOrMissingTyping.length > 0) {
    console.log(
      chalk`- there were ${String(
        incorrectOrMissingTyping.length
      )} handler functions who defined a {italic config} but did not type it as {bold IWrapperFunction}`
    );
    console.log(
      chalk`{grey - the function configs needing attention are: {italic ${incorrectOrMissingTyping
        .map((i) => i.config.handler)
        .join(", ")}}}`
    );
  }
}
