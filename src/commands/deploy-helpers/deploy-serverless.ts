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
    chalk`- {bold serverless} {italic function} deployment for {italic ${stage}} stage ${
      emoji.party
    }`
  );
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
  try {
    fns.map(fn => {
      promises.push(
        asyncExec(
          `sls deploy function --force --aws-s3-accelerate --function ${fn} --stage ${stage}`
        )
      );
    });
    await Promise.all(promises);
    console.log(chalk`- The functions were all deployed! ${emoji.rocket}`);
  } catch (e) {
    console.log(
      chalk`- {red {bold problems deploying functions!}} ${emoji.poop}`
    );
    console.log(`- ${e.message}`);
    console.log(chalk`- {dim ${e.stack}}`);
  }
}

async function fullDeploy(meta: IServerlessDeployMeta) {
  const { stage, opts, config } = meta;
  console.log(
    chalk`- {bold FULL serverless} deployment for {italic ${stage}} stage ${
      emoji.party
    }`
  );
  if (config.showUnderlyingCommands) {
    console.log(
      chalk`{grey > {italic sls deploy --aws-s3-accelerate  --stage ${stage} --verbose}}\n`
    );
    try {
      await asyncExec(
        `sls deploy --aws-s3-accelerate  --stage ${stage} --verbose`
      );
      console.log(chalk`\n- The full deploy was successful! ${emoji.rocket}\n`);
    } catch (e) {
      console.log(chalk`- {red Error running deploy!}`);
      console.log(
        chalk`- NOTE: {dim if the error appears related to running out of heap memory then you can try {bold {yellow export NODE_OPTIONS=--max_old_space_size=4096}}}\n`
      );
    }
  }
}
