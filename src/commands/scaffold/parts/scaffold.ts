// import chalk from "chalk";
import { IScaffoldOptions } from "./meta";
import { IGlobalOptions, DoDevopsHandler } from "~/@types";
import {
  askCheckboxQuestion,
  askConfirmQuestion,
  askInputQuestion,
  askListQuestion,
} from "~/shared/interactive";
import { installEsLint, installTestFramework } from "~/shared/install";
import chalk from "chalk";
import { asyncExec } from "async-shelljs";
import { getSubdirectories } from "~/shared/file/utility";
import { wordWrap } from "~/shared/ui";

const scaffolds = ["typescript", "eslint", "jest", "vitesse"];

export const handler: DoDevopsHandler<IGlobalOptions<IScaffoldOptions>> = async ({
  opts,
  observations,
}) => {
  const which = await askCheckboxQuestion("choose the scaffolds you want to use", scaffolds);

  if (which.includes("eslint")) {
    await installEsLint(opts, observations);
  }
  if (which.includes("jest")) {
    await installTestFramework("jest", opts, observations);
  }
  if (which.includes("vitesse")) {
    let confirm: boolean = true;
    let dir: string = ".";
    if (observations.has("packageJson")) {
      confirm = await askConfirmQuestion(
        chalk`- install {bold {blue Vitesse}} starter template for VueJS/ViteJS into {bold {yellow current}} directory?`
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
      await asyncExec(`npx degit antfu/vitesse ${dir}`);
      console.log(chalk``);
    } else {
      process.exit();
    }
  }

  return;
};
