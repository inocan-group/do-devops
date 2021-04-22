import chalk from "chalk";
import { IDictionary } from "common-types";
import { emoji } from "~/shared/ui";
import { getValidServerlessHandlers } from "~/shared/ast";
import { IBuildTool } from "~/@types";
import { IBuildToolingOptions } from "../../build-helpers/tools/types";
import { askBuildTool } from "../../build-helpers/index";
import { isServerless } from "~/shared/observations";
import { getConfig } from "~/shared/core";

export const defaultConfig = {
  preBuildHooks: ["clean"],
  targetDirectory: "dist",
  buildTool: "tsc",
};

export async function handler(argv: string[], opts: IDictionary) {
  const { build: config } = await getConfig();
  const serverless = await isServerless();
  const buildTool: IBuildTool =
    opts.buildTool || config.buildTool || (await askBuildTool(serverless ? true : false));

  const tooling: (options?: IBuildToolingOptions) => Promise<any> = (
    await import(`./build-helpers/tools/${buildTool}`)
  ).default;

  if (opts.output && !opts.quiet) {
    console.log(
      chalk`{red - the "--output" option is a general option but has no meaning for the {bold build} command} ${emoji.angry}. The build will continue, ignoring this flag.`
    );
  }

  if (serverless) {
    console.log(chalk`{bold {yellow - Starting SERVERLESS build process}}\n`);

    // await buildLambdaTypescriptProject(opts, config);
  } else {
    console.log(chalk`{bold {yellow - Starting code build process; using ${buildTool}}}`);
    const fns = argv.length > 0 ? argv : getValidServerlessHandlers();
    await tooling({ fns, opts });
  }

  console.log(chalk`\n- {bold build} complete ${emoji.party}\n`);
}
