import chalk from "chalk";
import { IDictionary, IServerlessFunction } from "common-types";
import { namedExports, parseFile } from "./index";

/**
 * Given a handler file, this will return the object key/value
 * pairs of the file's `config` export. It will also provide a
 * list of functions who's `config` export did _not_ expressly
 * type the config as `IWrapperFunction`
 */
export function findHandlerConfig(
  filename: string,
  /** the _package_ section should be replaced with a reference to the `filename.zip` */
  isWebpackZip: boolean = false
) {
  const ast = parseFile(filename);
  const hash: IDictionary = {};
  const config = namedExports(ast).find((i) => i.name === "config");
  if (!config) {
    return;
  } else {
    const fn = (filename.split("/").pop() || "").replace(".ts", "");

    for (const i of config.properties || []) {
      hash[i.name] = i.value;
    }

    hash.handler = isWebpackZip
      ? `.webpack/${fn}.handler`
      : filename.replace(".ts", ".handler");

    if (isWebpackZip) {
      if (hash.package) {
        console.log(
          chalk`{grey - the handler function "${fn}" had a defined package config but it will be replaced by a {italic artifact} reference}`
        );
      }
      hash.package = { artifact: `.webpack/${fn}.zip` };
    }

    return {
      interface: config.interface,
      config: hash as IServerlessFunction,
    };
  }
}
