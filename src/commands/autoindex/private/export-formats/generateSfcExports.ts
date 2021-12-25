import { Options } from "~/@types/global";
import type { IAutoindexOptions } from "~/commands/autoindex/parts";
import { IAutoindexFile, removeExtension } from "~/commands/autoindex/private";

/**
 * Checks to see that the **sfc** option has been turned on and if it has,
 * will export all the `.vue` files it finds in the appropriate format.
 */
export function generateSfcExports(indexFile: IAutoindexFile, opts: Options<IAutoindexOptions>) {
  const vueFiles = indexFile.files.filter((f) => f.includes(".vue"));
  if (!opts.sfc || vueFiles.length === 0) {
    return "";
  }

  let content = "// SFC Components\n";
  vueFiles.map((f) => {
    content += `export { default as ${removeExtension(f)} } from "./${f}";\n`;
  });

  return content;
}
