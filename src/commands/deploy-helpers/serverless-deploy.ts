import { IDoDeployServerless, IDoConfig } from "../defaults";
import { asyncExec } from "async-shelljs";
import chalk from "chalk";
import { sandbox } from "../../shared/sandbox";

/**
 * Manages the execution of a serverless deployment
 */
export default async function serverlessDeploy(
  deploy: IDoDeployServerless,
  global: IDoConfig
) {
  //
}

async function functionDeploy(
  fns: string[],
  stage: string,
  config: IDoDeployServerless
) {
  console.log(`- deploying ${fns.length} functions to "${stage}" stage: `);
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

async function fullDeploy(stage: string) {
  // await asyncExec();
}
