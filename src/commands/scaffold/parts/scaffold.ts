// import chalk from "chalk";
import { IScaffoldOptions } from "./meta";
import { IGlobalOptions, DoDevopsHandler } from "~/@types";
import { askCheckboxQuestion } from "~/shared/interactive";
import { installEsLint, installTestFramework } from "~/shared/install";

const scaffolds = ["typescript", "eslint", "jest"];

export const handler: DoDevopsHandler<IGlobalOptions<IScaffoldOptions>> = async ({ opts,
  observations,
}) => {
  const which = await askCheckboxQuestion("choose the scaffolds you want to use", scaffolds);

  if (which.includes("eslint")) {
    await installEsLint(opts, observations);
  }
  if (which.includes("jest")) {
    await installTestFramework("jest", opts, observations);
  }

  return;
};
