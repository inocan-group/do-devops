import chalk from "chalk";
import { IDoDevopsCommand } from "src/@types";
const autoindex = chalk`{bgWhite {black autoindex }}`;

export const description: IDoDevopsCommand["description"] = {
  short: chalk`Automates the building of {italic index.ts} files to aggregate folder's content`,
  complete: chalk`Automates the building of {italic index} files; if you include a comment starting with {bold {yellow // #autoindex}} in a index file it will be auto-indexed when calling {blue do autoindex}.
  
By default ${autoindex} will assume that you are using {italic named} exports but this can be configured to what you need. Options are: {italic named, default,} and {italic named-offset}. To configure, simply add something like {bold {yellow // #autoindex:default}} to your file.

If you need to exclude certain files you can state the exclusions after the autoindex declaration: {bold {yellow // #autoindex, exclude:a,b,c}}`,
};
