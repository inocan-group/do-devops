// import chalk from "chalk";
import { IScaffoldOptions } from "./meta";
import { Options, DoDevopsHandler } from "~/@types";
import {
  askCheckboxQuestion,
  askConfirmQuestion,
  askInputQuestion,
  askListQuestion,
} from "~/shared/interactive";
import {
  installEsLint,
  installGit,
  installGitIgnore,
  installTestFramework,
  installTypescript,
} from "~/shared/install";
import chalk from "chalk";
import { asyncExec } from "async-shelljs";
import { getSubdirectories } from "~/shared/file/utility";
import { emoji, wordWrap } from "~/shared/ui";
import { Keys } from "inferred-types";

const scaffolds = [
  "gitignore",
  "git",
  "typescript",
  "eslint",
  "jest",
  "vitesse",
  "vitesse-webext",
] as const;

export const handler: DoDevopsHandler<Options<IScaffoldOptions>> = async ({
  opts,
  observations,
}) => {
  opts = { ...opts, silent: true };
  const which = await askCheckboxQuestion<Keys<typeof scaffolds>>(
    "choose the scaffolds you want to use",
    scaffolds
  );

  if (which.includes("gitignore")) {
    await installGitIgnore(opts);
  }
  if (which.includes("git")) {
    await installGit(opts);
  }

  if (which.includes("typescript")) {
    await installTypescript(opts, observations);
  }

  if (which.includes("eslint")) {
    await installEsLint(opts, observations);
  }
  if (which.includes("jest")) {
    await installTestFramework("jest", opts, observations);
  }
  if (which.includes("vitesse") || which.includes("vitesse-webext")) {
    const pkg = which.includes("vitesse-webext") ? "vitesse-webext" : "vitesse";
    let confirm: boolean = true;
    let dir: string = ".";
    if (observations.has("packageJson")) {
      confirm = await askConfirmQuestion(
        chalk`- install {bold {blue Vitesse${
          pkg.includes("ext") ? chalk`{italic  browser extension}` : ""
        }}} starter template for VueJS/ViteJS into {bold {yellow current}} directory?`
      );
    } else {
      const dirChoices = [
        "current directory",
        ...getSubdirectories(process.cwd()),
        "(new subdirectory)",
      ];
      const subOrCurrent = await askListQuestion<string>(
        wordWrap(
          chalk`- since you're not in a dir with a {italic package.json} we need to establish which directory you want to install the {bold blue Vitesse} start template into.`
        ),
        dirChoices
      );
      if (subOrCurrent === "(new subdirectory)") {
        dir = await askInputQuestion("- specify directory name:");
      } else if (subOrCurrent === "current directory") {
        dir = ".";
      } else {
        dir = subOrCurrent;
      }
    }

    if (confirm) {
      asyncExec(`npx degit antfu/${pkg} ${dir} --force`);
      console.log(
        chalk`- vitesse ${pkg.includes("ext") ? "browser extension " : ""}template installed`
      );
      await asyncExec(`pnpm install`);
      console.log(
        chalk`\n- ${emoji.party} Vitesse ${
          pkg.includes("ext") ? "browser extension " : ""
        }template installed and all deps are loaded \n`
      );
    } else {
      process.exit();
    }
  }

  return;
};
