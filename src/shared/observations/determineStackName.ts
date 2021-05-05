import chalk from "chalk";
import { DoDevopObservation, IAwsOptions, IGlobalOptions } from "~/@types";
import { DevopsError } from "~/errors";
import { logger } from "~/shared/core";
import { getProjectConfig, saveProjectConfig } from "../config";
import { askInputQuestion } from "../interactive";
import { getPackageJson } from "../npm";

export async function determineStackName(
  opts: IGlobalOptions<IAwsOptions>,
  _observations: Set<DoDevopObservation>
) {
  const log = logger(opts);
  const config = getProjectConfig();
  const pkg = getPackageJson();

  if (config.aws?.defaultStackName) {
    return config.aws.defaultStackName;
  }

  if (opts.interactive) {
    log.shout(
      chalk`- It appears that we have not set a default {bold {blue stack name}} for this repo.`
    );
    log.info(
      chalk`{gray - a {italic stack name} acts effectively as a "namespace" for all your serverless assets.}`
    );
    log.info(
      chalk`{gray - the naming of each function, table, step function, etc. starts with this stack name. }`
    );
    log.info(
      chalk`{gray - its not uncommon to have the stack name be the same as your repo's name but its whatever you want it to be.}`
    );
    log.shout();
    const stackName = await askInputQuestion(
      chalk`- Please choose a stack name and we will store this in your {blue .do-devops.json} config file`,
      { default: pkg.name }
    );
    if (stackName && stackName.length > 0) {
      saveProjectConfig({ aws: { defaultStackName: stackName } });
      return stackName;
    } else {
      throw new DevopsError(`Empty stack names are not allowed!`, "invalid/blank-stack-name");
    }
  }

  return false;
}
