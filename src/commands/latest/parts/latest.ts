import chalk from "chalk";
import { git } from "src/shared/git";
import { emoji } from "src/shared/ui";
import { getPackageJson } from "src/shared/npm";
import { DoDevopsHandler } from "src/@types/command";

export const handler: DoDevopsHandler = async ({ opts }) => {
  const g = git();

  const { latest } = await g.tags();
  const status = await g.status();
  const pkg = getPackageJson();
  if (!pkg) {
    console.log(
      `- the "latest" command provides you with the latest version of the repo in the {italic current} directory`
    );
    console.log(
      `   however it appears you're in directory without a package.json file! ${emoji.shocked}\n`
    );
    console.log(
      `- please move to a new directory or pass in the optional '--repo [repo]' parameter to name a repo`
    );

    process.exit();
  }
  const pkgVersion = pkg.version;

  const aheadBehind =
    status.ahead === 0 && status.behind === 0
      ? ""
      : `\n- Your local repo is ${
          status.ahead > 0
            ? `ahead by ${status.ahead} commits`
            : `behind by ${status.behind} commits`
        }`;

  const changes =
    status.not_added.length === 0 && status.modified.length === 0
      ? ""
      : `\n- Locally you have {yellow ${
          status.not_added.length > 0 ? status.not_added.length : "zero"
        }} {italic new} files and {yellow ${status.modified.length}} {italic modified} files`;

  const conflicts =
    status.conflicted.length === 0
      ? ""
      : `- ${emoji.poop} There are {bold {red ${status.conflicted.length}}} conflicted files!`;

  if (opts.verbose) {
    console.log(
      `The remote repo's latest version is {bold {yellow ${latest}}}; {blue package.json} is ${
        pkgVersion === latest ? "the same" : `is {bold ${pkgVersion}}`
      }.${aheadBehind}${changes}${conflicts}`
    );

    console.log("\n");
  } else {
    console.log(latest);
  }
  return latest;
};
