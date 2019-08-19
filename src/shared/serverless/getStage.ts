import { getServerlessYaml } from "./index";
import { IDictionary } from "common-types";
import { DevopsError } from "../errors";
import { getAwsProfileFromServerless } from "./getAwsProfileFromServerless";
import chalk from "chalk";
import { emoji } from "../ui";

/**
 * Uses various methods to determine which _stage_
 * the serverless function should be deployed to.
 * If the stage can not be determined than the user
 * will be asked interactively.
 *
 * @param opts the CLI options hash (which includes stage as
 * a possible parameter)
 */
export async function getStage(opts: IDictionary) {
  try {
    const profile = await getAwsProfileFromServerless();

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
