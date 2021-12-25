import chalk from "chalk";
import { DoDevopObservation, Options } from "~/@types";
import { logger } from "~/shared/core";
import { getValidStepFunctions } from "~/shared/ast";
import { IBuildOptions } from "../parts";

export async function processStepFns(
  opts: Options<IBuildOptions>,
  _observations: Set<DoDevopObservation>
) {
  const log = logger(opts);
  const stepFns = getValidStepFunctions(opts);
  if (stepFns) {
    log.info(chalk`- found {yellow {bold ${stepFns.length}}} Step Function`);
  }
}
