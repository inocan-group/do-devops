import chalk from "chalk";
import { IDictionary } from "common-types";
import { OptionDefinition } from "command-line-usage";

import { detectTarget } from "./deploy-helpers";
import { emoji } from "~/shared/ui";

export const defaultConfig = {
  preDeployHooks: ["clean"],
  target: "serverless",
  showUnderlyingCommands: true,
  sandboxing: "user",
};

export async function description(_opts: IDictionary) {
  const base =
    "Deployment services that for {bold Serverless} or {bold NPM} publishing.\n\n";
  const detect = await detectTarget();

  const possibleTargets = {
    serverless: chalk`This project was detected to be a {bold Serverless} project. Unless you state explicitly that you want to use {bold NPM} targetting it will use Serverless.`,
    npm: chalk`This project was detected to be a {bold NPM} project. Unless you state explicitly that you want to use "serverless" targetting it will use NPM. `,
    both: chalk`This project was detected to have both {bold Serverless} functions {italic and} be an {bold NPM} library. By default the deploy command will assume you want to use {bold Serverless} deployment but the {italic options} listed below allow for both targets.`,
    bespoke: "not implemented yet",
  };

  return base + possibleTargets[detect.target as keyof typeof possibleTargets];
}

export const syntax =
  "dd deploy [fn1] [fn2] <options>\n\n{dim Note: {italic stating particular functions is {italic optional} and if excluded will result in a full deployment of all functions.}}";

export async function options(_opts: IDictionary): Promise<OptionDefinition[]> {
  // const { deploy: config } = await getConfig();
  // const target = opts.target || config.target;

  return [
    {
      name: "interactive",
      alias: "i",
      type: Boolean,
      group: "serverlessDeploy",
      description: "allow interactive choices for the functions you want to deploy",
    },
    {
      name: "target",
      alias: "t",
      typeLabel: "<target>",
      type: String,
      group: "deploy",
      description: "manually override the project target (serverless, npm)",
    },
    {
      name: "stage",
      alias: "s",
      typeLabel: "<stage>",
      type: String,
      group: "serverlessDeploy",
      description: "manually override the stage you're deploying to",
    },
    {
      name: "region",
      alias: "r",
      typeLabel: "<region>",
      type: String,
      group: "serverlessDeploy",
      description: "explicitly state the region you're deploying to",
    },
  ];
}

/**
 * **Deploy Handler**
 *
 * The _deploy_ command is used when you want to push your changes
 * to an environment where they will be used. This can mean different
 * things based on context and this handler will support the following
 * deployment scenarios:
 *
 * 1. Deploy to `npm` (aka, publish)
 * 2. Deploy to a serverless environment by leveraging the **Serverless** framework
 *
 * Over time we may add other targets for deployment.
 */
export async function handler(argv: string[], opts: any) {
  // const { deploy, global } = await getConfig();
  let { target } = await detectTarget(opts);
  if (target === "both") {
    const ask = (await import(`./deploy-helpers/deploy-${target}`)).default;
    target = await ask(opts);
  }

  if (!target) {
    console.log(
      `  - ${emoji.poop} You must state a valid "target" [ ${
        target ? target + "{italic not valid}" : "no target stated"
      } ]`
    );
  }

  // await runHooks(deploy.preDeployHooks);
  const helper = (await import(`./deploy-helpers/deploy-${target}`)).default;
  await helper(argv, opts);
}
