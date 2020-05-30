import * as chalk from "chalk";

import { emoji } from "../../shared";

/**
 * Manages the execution of a NPM deployment
 * (aka, a "publish" event)
 */
export default function npmDeploy() {
  console.log(chalk`- {bold npm} build starting ${emoji.party}`);
}
