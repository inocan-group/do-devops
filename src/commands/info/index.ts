import chalk from "chalk";
import { IDoDevopsCommand } from "~/@types/command";
import { emoji, getPackageJson, pkgDepsInTable } from "~/shared";
import { otherPackages, thisRepo } from "./parts";

export interface IInfoOptions {
  allDeps?: boolean;
  listDeps?: boolean;
}

const command: IDoDevopsCommand<IInfoOptions> = {
  kind: "info",
  handler: async ({ argv, opts, observations }) => {
    if (opts.listDeps) {
      console.log(pkgDepsInTable());
      return;
    }
    if (opts.allDeps) {
      const pkg = getPackageJson();
      const deps = Object.keys(pkg.dependencies || {});
      if (deps.length === 0) {
        console.log(`- there are no dependencies for this repo\n`);
        process.exit();
      }

      console.log(
        chalk`- ${emoji.run} getting NPM info for {bold {yellow ${String(
          deps.length
        )}}} dependencies`
      );

      return otherPackages(deps, opts, observations);
    }
    return argv?.length > 0
      ? otherPackages(argv, opts, observations)
      : thisRepo(opts, observations);
  },
  description:
    "Summarized information about the current repo; or alternatively a set of external npm packages (if stated).",
  syntax: "dd info <repo1> <repo2> ... [options]",
  options: {
    allDeps: {
      type: Boolean,
      alias: "a",
      group: "local",
      description: "If specified, will provide info across all of this repo's dependencies",
    },
    listDeps: {
      type: Boolean,
      alias: "l",
      group: "local",
      description: "List in tabular format all deps: deps, dev deps, optional and peer",
    },
  },
  greedy: true,
};

export default command;
