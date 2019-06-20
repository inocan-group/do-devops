import globby from "globby";
import fs from "fs";
import chalk from "chalk";
/**
 * Finds all `index.ts` and `index.js` files and looks for the `#autoindex`
 * signature. If found then it _auto_-builds this file based on files in
 * the file's current directory
 */
export async function handler() {
  const paths = await globby(["**/index.ts", "**/index.js", "!node_modules"]);
  const filesToComplete = await findAutoCompleteFiles(paths);
}

async function findAutoCompleteFiles(paths: string[]) {
  const result: string[] = [];
  for (const path of paths) {
    const fileString = fs.readFileSync(path, { encoding: "utf-8" });
    if (fileString.includes("// #autoindex:")) {
      result.push(path);
    }
  }
  if (result.length === 0) {
    console.log(
      `- Scanned through ${chalk.bold(String(paths.length))} ${chalk.italic(
        "index"
      )} files but none of them were "autoindex" files.\n`
    );
    console.log(
      `${chalk.bold("  Note: ")}${chalk.dim.italic(
        'to make an "index.ts" or "index.js" file an "autoindex file"'
      )}`
    );
    console.log(
      chalk.dim.italic(
        "  you must add in the following to your index file (ideally on the first line):\n"
      )
    );

    console.log("  " + chalk.whiteBright.bgBlue("//#autoindex:[CMD] \n"));
    console.log(
      chalk.dim.italic("  where the valid commands are (aka, CMD from above): ") +
        chalk.italic("named,defaults")
    );
  }
  console.log();
}
