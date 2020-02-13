import { getServerlessYaml, askForStage } from "./index";
import { IDictionary } from "common-types";
import chalk from "chalk";
import { emoji } from "../ui";
import * as process from "process";
import { get } from "lodash";
import { IDetermineOptions } from "../../@types";

/**
 * Uses various methods to determine which _stage_
 * the serverless function should be deployed to.
 * If the stage can not be determined than the user
 * will be asked interactively.
 *
 * @param opts the CLI options hash (which includes stage as
 * a possible parameter)
 */
export async function determineStage(opts: IDetermineOptions) {
  try {
    let stage =
      get(opts, "stage") || process.env.NODE_ENV || process.env.AWS_STAGE;

    if (!stage) {
      try {
        stage = get(await getServerlessYaml(), "provider.stage", undefined);
      } catch (e) {}
    }

    if (opts.interactive) {
      stage = await askForStage();
    }

    return stage;
  } catch (e) {
    console.log(
      chalk`- attempts to get the desired "stage" have failed! ${emoji.poop}`
    );
    console.log(chalk`- {red ${e.message}}`);
    console.log(chalk`{dim ${e.stack}}`);
    console.log();

    process.exit();
  }
}
