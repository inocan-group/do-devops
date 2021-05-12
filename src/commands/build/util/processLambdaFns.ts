import chalk from "chalk";
import { DoDevopObservation, IDiscoveredConfig, IGlobalOptions } from "~/@types";
import { currentDirectory, write, getFileComponents } from "~/shared/file";
import { findHandlerConfig, getValidServerlessHandlers } from "~/shared/ast";
import { logger } from "~/shared/core";
import { createTsFile } from "~/shared/file/createTsFile";
import { lintfix } from "~/shared/file/lintfix";
import { emoji } from "~/shared/ui";
import { reportOnFnConfig } from ".";
import { IBuildOptions } from "../parts";
import { FNS_TYPES_FILE } from "~/constants";
import { saveProjectConfig } from "~/shared/config";

/**
 * Process through all handler functions, and:
 *
 * - build `LambdaFunction` enum and corresponding `ILambdaFunction` type
 * - save config for all functions to project's config file
 */
export async function processLambdaFns(
  opts: IGlobalOptions<IBuildOptions>,
  observations: Set<DoDevopObservation>
) {
  /** handler functions list */
  const fns = getValidServerlessHandlers(opts);
  const log = logger(opts);

  if (fns.length === 0) {
    log.shout(
      chalk`- ${emoji.eyeballs} no lambda function handlers found; see docs for how to ensure your fns are found`
    );
    log.info(chalk`{gray - document can be found at {blue https://aws-orchestrate.com}}`);
    return;
  }

  log.info(chalk`- found {yellow {bold ${fns.length}}} lambda functions`);
  const fnConfig = fns.map((fn) => findHandlerConfig(fn));
  log.whisper(chalk`{gray - configuration blocks for lambda functions retrieved}`);
  const report = reportOnFnConfig(fnConfig);
  if (report.interfaces.has("IWrapperFunction")) {
    log.info(
      chalk`- ${emoji.angry} detected use of {italic deprecated} {inverse  IWrapperFunction } interface; please switch to {inverse  IHandlerConfig } instead.`
    );
    log.whisper(
      chalk`- The following {bold ${
        report.usage.withOtherInterface
      }} handler fns are missing the appropriate typing:\n\t{dim ${report.usage.handlersWithOtherInterface
        .map((i) => getFileComponents(i).filename)
        .join("\t")}}`
    );
  }

  const lambda = fnConfig.filter((f) => f !== undefined) as IDiscoveredConfig[];
  write(
    currentDirectory(FNS_TYPES_FILE),
    createTsFile()
      .addStringEnum({
        name: "LambdaFunction",
        description: "an enumeration of all locally defined lambda functions",
        elements: lambda.map((l) => ({
          el: `${getFileComponents(l.config.handler).filename.replace(".handler", "")}`,
          comment: l.config.description,
        })),
      })
      .addType("ILambdaFunction", "keyof typeof LambdaFunction")
      .generate(),
    { allowOverwrite: true }
  );

  lintfix(currentDirectory(FNS_TYPES_FILE), observations);

  saveProjectConfig({
    build: {
      lambda: lambda.map((f: IDiscoveredConfig) => f.config),
    },
  });
  log.whisper(chalk`{gray - functions saved to the {italic do-devops} project config file}`);
}
