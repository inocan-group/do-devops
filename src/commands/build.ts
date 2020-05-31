import * as chalk from "chalk";

import { askBuildTool, serverlessTranspilation } from "./build-helpers/index";
import { buildServerlessMicroserviceProject, emoji, getConfig, isServerless } from "../shared";

import { IBuildTool } from "../@types";
import { IBuildToolingOptions } from "./build-helpers/tools/types";
import { IDictionary } from "common-types";
import { OptionDefinition } from "command-line-usage";
import { getValidServerlessHandlers } from "../shared/ast";

export const defaultConfig = {
  preBuildHooks: ["clean"],
  targetDirectory: "dist",
  buildTool: "tsc",
};

export const options: OptionDefinition[] = [
  {
    name: "force",
    type: Boolean,
    group: "build",
    description: `forces the transpiling of code when building a serverless project`,
  },
  {
    name: "interactive",
    alias: "i",
    type: Boolean,
    group: "build",
    description: `allows choosing the functions interactively`,
  },
];

export function description() {
  return `Efficient and clear build pipelines for serverless and/or NPM libraries`;
}

export async function handler(argv: string[], opts: IDictionary) {
  const { build: config } = await getConfig();
  const serverless = await isServerless();
  const buildTool: IBuildTool = opts.buildTool || config.buildTool || (await askBuildTool(serverless ? true : false));

  const tooling: (options?: IBuildToolingOptions) => Promise<any> = (await import(`./build-helpers/tools/${buildTool}`))
    .default;

  if (opts.output && !opts.quiet) {
    console.log(
      chalk`{red - the "--output" option is a general option but has no meaning for the {bold build} command} ${emoji.angry}. The build will continue, ignoring this flag.`
    );
  }

  if (serverless) {
    console.log(chalk`{bold {yellow - Starting SERVERLESS build process}}\n`);
    await serverlessTranspilation({ argv, opts, config, tooling, serverless });
    await buildServerlessMicroserviceProject(opts, config);
  } else {
    console.log(chalk`{bold {yellow - Starting code build process; using ${buildTool}}}`);
    const fns = argv.length > 0 ? argv : getValidServerlessHandlers();
    await tooling({ fns, opts });
  }

  console.log(chalk`\n- {bold build} complete ${emoji.party}\n`);
}
