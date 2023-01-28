import chalk from "chalk";

export function communicateApi(paths: string[]) {
  console.log(
    `- Scanned through ${chalk.bold(String(paths.length))} ${chalk.italic(
      "index"
    )} files but none of them were "autoindex" files.\n`
  );
  console.log(
    `${chalk.bold("  Note: ")}${chalk.dim.italic(
      "to make an \"index.ts\" or \"index.js\" file an \"autoindex file\""
    )}`
  );
  console.log(
    chalk.dim.italic(
      "  you must add in the following to your index file (ideally on the first line):\n"
    )
  );

  console.log("  " + chalk.whiteBright.bgBlue("// #autoindex:[CMD] \n"));
  console.log(
    chalk.dim.italic("  where the valid commands are (aka, CMD from above): ") +
      chalk.italic("named,defaults")
  );
  console.log(
    `  ${chalk.white.bold`Note:`}\n    ${chalk.dim.italic`you can also add the "--add" flag to look for other regex files patterns`}`
  );
}
