import { IDoDeployServerless, IDoConfig } from "../defaults";
import { asyncExec } from "async-shelljs";
import chalk from "chalk";
import { sandbox } from "../../shared/sandbox";
import { emoji } from "../../shared/ui";
import { IDictionary, IServerlessConfig } from "common-types";
import { getConfig, getAwsProfileFromServerless, getStage } from "../../shared";

export interface IServerlessDeployMeta {
  stage: string;
  config: IDoDeployServerless;
  opts: IDictionary;
}

/**
 * Manages the execution of a serverless deployment
 */
export default async function serverlessDeploy(
  argv: string[],
  opts: IDictionary
) {
  const stage = await getStage(opts);
  const { deploy: config } = await getConfig();
  const meta = { stage, config: config as IDoDeployServerless, opts };
  console.log(
    chalk`- {bold serverless} deployment starting for {italic ${stage}} stage ${
      emoji.party
    }`
  );
  // argv values indicate function deployment
  if (argv.length > 0) {
    await functionDeploy(argv, meta);
  } else {
    await fullDeploy(meta);
  }
}

async function functionDeploy(fns: string[], meta: IServerlessDeployMeta) {
  const { stage, opts, config } = meta;
  console.log(
    chalk`- deploying {bold ${String(
      fns.length
    )} functions} to "${stage}" stage`
  );
  const sandboxStage = stage === "dev" ? await sandbox(stage) : stage;
  if (sandboxStage !== stage) {
  }
  fns.forEach(fn => console.log(chalk.grey(`    - ${fn}`)));

  const promises: any[] = [];
  fns.map(fn => {
    promises.push(
      asyncExec(
        `sls deploy function --force --aws-s3-accelerate --function ${fn} --stage ${stage}`
      )
    );
  });
  await Promise.all(promises);
}

async function fullDeploy(meta: IServerlessDeployMeta) {
  const { stage, opts, config } = meta;
  console.log(chalk`- deploying {bold all} functions to {bold ${stage}} stage`);
}
