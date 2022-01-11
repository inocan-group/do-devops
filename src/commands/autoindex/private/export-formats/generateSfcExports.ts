import chalk from "chalk";
import { Options } from "~/@types/global";
import type { IAutoindexOptions } from "~/commands/autoindex/parts";
import { IAutoindexFile, removeExtension } from "~/commands/autoindex/private";
import { getProjectConfig } from "~/shared/config";
import { logger } from "~/shared/core/logger";

/**
 * Checks to see that the **sfc** option has been turned on and if it has,
 * will export all the `.vue` files it finds in the appropriate format.
 */
export function generateSfcExports(indexFile: IAutoindexFile, opts: Options<IAutoindexOptions>) {
  const log = logger(opts);
  const vueFiles = indexFile.files.filter((f) => f.includes(".vue"));
  if (!opts.sfc || vueFiles.length === 0) {
    return "";
  }
  
  let content = "// SFC Components\n";
  // we are going to import SFC's but what type? Sync or Async?
  const pc = getProjectConfig();
  if(opts.async || pc.autoindex?.asyncSfc) {
    content += `import { defineAsyncComponent } from "vue";\n`;
    vueFiles.map(f => {
      if(!(pc.autoindex?.asyncExceptions || []).includes(f)) {
        content += `export const ${removeExtension(f)} = defineAsyncComponent({\n`;
        content += `  loader: async () => import("./${f}") /** webpackChunkName: "${removeExtension(f)}" */,\n`;
        content += `});`;
      }
    });
  } else {
    if(opts.sfc && pc.autoindex?.asyncSfc === undefined) {
      log.info(chalk`- you have stated that you want SFC exported but {italic not} if you want them to be asynchronous. Consider setting the {blue autoindex.asyncSfc} property in your do-devops config file.`);
    }
    vueFiles.map((f) => {
      content += `export { default as ${removeExtension(f)} } from "./${f}";\n`;
    });
  }




  return content;
}
