
import { IDoDevopsCommand } from "src/@types";
// const autoindex = chalk.bgWhite.black`autoindex`;
// const autoindexComment = chalk.bgWhiteBright.blackBright`// autoindex`;

export const description: IDoDevopsCommand["description"] = {
  short: `Automates the building of index files`,
  complete: `Automates the building of index files`
};


// {
//   short: `Automates the building of ${chalk.italic`index.[ts | js]`} files`,
//   complete: `Automates the building of ${chalk.italic`index`} files in a given repo.
  
//   Any index file (JS or TS) which is either completely empty ${chalk.italic`or`} contains a comment
//   which looks has a line that starts with ${autoindexComment} will be managed by the ${autoindex}
//   command.`,
// };
