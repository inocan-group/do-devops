import { getServerlessYaml } from "./index";
import { IDictionary } from "common-types";
import chalk from "chalk";
import { emoji } from "../ui";
import { determineProfile } from "./determineProfile";

/**
 * Uses various methods to determine which _stage_
 * the serverless function should be deployed to.
 * If the stage can not be determined than the user
 * will be asked interactively.
 *
 * @param opts the CLI options hash (which includes stage as
 * a possible parameter)
 */
export async function determineStage(opts: IDictionary) {
  try {
    if (opts.stage) {
      return opts.stage;
    }

    const profile = await determineProfile({ cliOptions: opts });

    const stage =
      opts.stage ||
      process.env.NODE_ENV ||
      process.env.AWS_STAGE ||
      (await getServerlessYaml()).provider.stage;

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
