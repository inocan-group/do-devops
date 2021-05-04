import chalk from "chalk";
import * as process from "process";

import { askForStage, getServerlessYaml } from "../serverless/index";

import { emoji } from "../ui";
import { get } from "lodash";
import { DoDevopObservation, Observations } from "~/@types";

export interface IStageOptions {
  interactive?: boolean;
  stage?: string;
  profile?: string;
}

/**
 * Uses various methods to determine which _stage_
 * the serverless function should be deployed to.
 * If the stage can not be determined than the user
 * will be asked interactively.
 *
 * @param opts the CLI options hash (which includes stage as
 * a possible parameter)
 */
export async function determineStage(
  opts: IStageOptions,
  _observations: Observations = new Set<DoDevopObservation>()
) {
  try {
    let stage = get(opts, "stage") || process.env.NODE_ENV || process.env.AWS_STAGE;

    if (!stage) {
      try {
        stage = get(await getServerlessYaml(), "provider.stage");
      } catch {}
    }

    if (opts.interactive) {
      stage = await askForStage();
    }

    return stage;
  } catch (error) {
    console.log(chalk`- attempts to get the desired "stage" have failed! ${emoji.poop}`);
    console.log(chalk`- {red ${error.message}}`);
    console.log(chalk`{dim ${error.stack}}`);
    console.log();

    process.exit();
  }
}
