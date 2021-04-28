import chalk from "chalk";

import { emoji } from "~/shared/ui";

/**
 * Manages the execution of a NPM deployment
 * (aka, a "publish" event)
 */
export default function npmDeploy() {
  console.log(chalk`- {bold npm} build starting ${emoji.party}`);
}
