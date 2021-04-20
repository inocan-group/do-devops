/* eslint-disable quotes */
import chalk from "chalk";
import path from "path";
import { writeFileSync } from "fs";
import {
  IDictionary,
  IServerlessFunction,
  isServerlessFunctionHandler,
} from "common-types";
import { IWebpackHandlerDates } from "~/@types";
import { relativePath } from "~/shared/file";
import { emoji } from "~/shared/ui";
import { findHandlerConfig } from "~/shared/ast";
import { hasDevDependency } from "~/shared/npm";
import { getConfig } from "../../do-config";

export interface IInlineExportConfig {
  interface: string;
  config: IServerlessFunction;
}

function objectPrint(obj: IDictionary) {
  const contents: string[] = [];
  for (const key of Object.keys(obj)) {
    let value = obj[key as keyof typeof obj];
    if (typeof value === "string") {
      value = `"${value.replace(/"/g, '\\"')}"`;
    }
    if (typeof value === "object") {
      value = JSON.stringify(value);
    }
    contents.push(`  ${key}: ${value}`);
    contents.join(",\n\t");
    continue;
  }

  return contents;
}

function warnAboutMissingTyping(config: IInlineExportConfig[]) {
  const incorrectOrMissingTyping = config.filter((i) => i.interface !== "IHandlerConfig");
  if (incorrectOrMissingTyping.length > 0) {
    console.log(
      chalk`- there were ${String(
        incorrectOrMissingTyping.length
      )} handler functions who defined a {italic config} but did not type it as {bold IHandlerConfig}`
    );
    console.log(
      chalk`{grey - the function configs needing attention are: {italic ${incorrectOrMissingTyping
        .map((i) =>
          isServerlessFunctionHandler(i.config) ? i.config.handler : i.config.image
        )
        .join(", ")}}}`
    );
  }
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
export async function createInlineExports(handlers: IWebpackHandlerDates[]) {
  const bespokeWebpack =
    (await getConfig()).build.buildTool === "webpack" &&
    !hasDevDependency("serverless-webpack");

  const header = 'import { IServerlessFunction } from "common-types";\n';
  const body: string[] = [];
  const config: IInlineExportConfig[] = [];
  for (const handler of handlers) {
    // const comments = findHandlerComments(handler);
    const handlerConfig = findHandlerConfig(handler.source, bespokeWebpack);
    if (handlerConfig && handlerConfig.interface) {
      config.push(handlerConfig as IInlineExportConfig);
    } else {
      console.log(
        chalk`- ${emoji.poop} the {red ${relativePath(
          handler.source
        )}} file will be ignored as a handler as it has no CONFIG section defined. This is probably a mistake!`
      );
    }
  }
  const exportSymbols: string[] = [];

  warnAboutMissingTyping(config);

  for (const handler of config) {
    if (isServerlessFunctionHandler(handler.config)) {
      const fnName = (handler?.config?.handler.split("/").pop() || "").replace(
        /\.[^.]+$/,
        ""
      );

      exportSymbols.push(fnName);
      const symbol = `const ${fnName}: IServerlessFunction = { 
  ${objectPrint(handler.config)}
  }
  `;
      body.push(symbol);
    } else {
      console.warn(
        `[${handler.config.image}]: the serverless function passed into createInlineExports appears to define an "image" rather than a "handler". This should be investigated!`
      );
    }
  }

  const file: string = `
${header}
${body.join("\n")}

export default {
  ${exportSymbols.join(",\n\t")}
}`;

  writeFileSync(
    path.join(process.env.PWD || "", "serverless-config/functions/inline.ts"),
    file,
    {
      encoding: "utf-8",
    }
  );
}
