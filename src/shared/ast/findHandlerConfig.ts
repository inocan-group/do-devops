import { parseFile, namedExports } from "./index";
import { IDictionary, IServerlessFunction } from "common-types";

/**
 * Given a handler file, this will return the object key/value
 * pairs of the file's `config` export. It will also provide a
 * list of functions who's `config` export did _not_ expressly
 * type the config as `IWrapperFunction`
 */
export function findHandlerConfig(filename: string) {
  const ast = parseFile(filename);
  const hash: IDictionary = {};
  const config = namedExports(ast).find(i => i.name === "config");

  config.properties.forEach(i => {
    hash[i.name] = i.value;
  });

  hash.handler = filename;

  return {
    interface: config.interface,
    config: hash as IServerlessFunction
  };
}
