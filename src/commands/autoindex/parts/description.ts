import chalk from "chalk";
import { IDoDevopsCommand } from "src/@types";
const autoindex = chalk.bgWhite.black`autoindex`;

export const description: IDoDevopsCommand["description"] = {
  short: `Automates the building of ${chalk.italic`index.ts`} files to aggregate folder's content`,
  complete: `Automates the building of ${chalk.italic`index`} files; if you include a comment starting with ${chalk.bold.yellow`\n// #autoindex\n`}in a index file it will be auto-indexed when calling ${chalk.blue`do autoindex`}.
  
By default ${autoindex} will assume that you are using ${chalk.italic`named`} exports but this can be configured to what you need. Options are: ${chalk.italic`named, default,`} and ${chalk.italic`named-offset`}. To configure, simply add something like ${chalk.bold.yellow`\n// #autoindex:default\n`}to your file.

If you need to exclude certain files you can state the exclusions after the autoindex declaration: ${chalk.bold.yellow`#autoindex, exclude:a,b,c`}`,
};
