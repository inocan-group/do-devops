import chalk from "chalk";
import { DoDevopObservation, IGlobalOptions, IProjectConfig } from "~/@types";
import { logger } from "~/shared";
import { getValidStepFunctions } from "~/shared/ast";
import { IBuildOptions } from "../parts";

export function processStepFns(
  _config: IProjectConfig,
  opts: IGlobalOptions<IBuildOptions>,
  _observations: Set<DoDevopObservation>
) {
  const log = logger(opts);
  const stepFns = getValidStepFunctions(opts);
  if (stepFns) {
    log.info(chalk`{gray - detected {bold ${stepFns.length}} Step Functions}`);
  }
}
