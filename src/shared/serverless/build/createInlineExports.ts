import { findHandlerComments, findHandlerConfig } from "../../ast/index";
import { IServerlessFunction, IDictionary } from "common-types";
import chalk from "chalk";
import { writeFileSync } from "fs";
import * as path from "path";

/**
 * Writes the serverless configuration file which contains
 * all the _inline_ function definitions found under `src/handlers`.
 */
export async function createInlineExports(files: string[]) {
  const header = 'import { IServerlessFunction } from "common-types";\n';
  let body: string[] = [];
  const config: Array<{ interface: string; config: IServerlessFunction }> = [];
  files.forEach(handler => {
    // const comments = findHandlerComments(handler);
    config.push(findHandlerConfig(handler));
  });
  const exportSymbols: string[] = [];

  const incorrectOrMissingTyping = config.filter(
    i => i.interface !== "IWrapperFunction"
  );
  if (incorrectOrMissingTyping.length > 0) {
    console.log(
      chalk`- there were ${String(
        incorrectOrMissingTyping.length
      )} handler functions who defined a {italic config} but did not type it as {bold IWrapperFunction}`
    );
    console.log(
      chalk`{grey - the function configs needing attention are: {italic ${incorrectOrMissingTyping
        .map(i => i.config.handler)
        .join(", ")}}}`
    );
  }
  config.forEach(handler => {
    const fnName = handler.config.handler
      .split("/")
      .pop()
      .replace(".ts", "");
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

  writeFileSync(
    path.join(process.env.PWD, "serverless-config/functions/inline.ts"),
    file,
    {
      encoding: "utf-8"
    }
  );
}

function objectPrint(obj: IDictionary) {
  let contents: string[] = [];
  Object.keys(obj).forEach(key => {
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
