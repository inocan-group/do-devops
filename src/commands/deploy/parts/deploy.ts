import { DoDevopsHandler } from "src/@types/command";
import { IOptionDefinition } from "src/@types/option-types";
import { proxyToPackageManager } from "src/shared/core/proxyToPackageManager";

export const defaultConfig = {
  preDeployHooks: ["clean"],
  target: "serverless",
  showUnderlyingCommands: true,
  sandboxing: "user",
};

export const description = "Deployment services for {bold Serverless}";

export const syntax =
  "dd deploy [fn1] [fn2] <options>\n\n{dim Note: {italic stating particular functions is {italic optional} and if excluded will result in a full deployment of all functions.}}";

export const options: IOptionDefinition = {
  interactive: {
    alias: "i",
    type: Boolean,
    group: "local",
    description: "allow interactive choices for the functions you want to deploy",
  },
  target: {
    alias: "t",
    typeLabel: "<target>",
    type: String,
    group: "local",
    description: "manually override the project target (serverless, npm)",
  },
  stage: {
    alias: "s",
    typeLabel: "<stage>",
    type: String,
    group: "local",
    description: "manually override the stage you're deploying to",
  },
  region: {
    alias: "r",
    typeLabel: "<region>",
    type: String,
    group: "local",
    description: "explicitly state the region you're deploying to",
  },
};

export interface IDeployOptions {
  interactive: boolean;
  target: string;
  stage: string;
  region: string;
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
export const handler: DoDevopsHandler<IDeployOptions> = async ({ observations }) => {
  // const { deploy, global } = await getConfig();
  if (observations.has("serverlessFramework")) {} else {
    await proxyToPackageManager("deploy", observations);
  }
};
