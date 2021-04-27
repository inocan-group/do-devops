import chalk from "chalk";
import { asyncExec } from "async-shelljs";
import { IDictionary } from "common-types";
import { IDoDeployServerless } from "~/@types";
import { getLocalHandlerInfo, zipWebpackFiles } from "~/shared/serverless";
import { emoji } from "~/shared/ui";
import { isTranspileNeeded } from "./index";
import { determineStage } from "~/shared/observations";
import { hasDevDependency } from "~/shared/npm";
import { getConfig } from "~/shared/core";

export interface IServerlessDeployMeta {
  stage: string;
  config: IDoDeployServerless;
  opts: IDictionary;
}

async function functionDeploy(fns: string[], meta: IServerlessDeployMeta) {
  const { stage } = meta;
  console.log(
    chalk`- {bold serverless} deployment for {bold ${String(
      fns.length
    )}} functions to {italic ${stage}} stage ${emoji.party}`
  );

  const transpile = isTranspileNeeded(meta);
  if (transpile.length > 0) {
    // const build = (await import("../../commands/build/util/tools/webpack")).default({
    //   opts: { fns: transpile },
    // }).build;
    // await build();
  }

  console.log(
    chalk`{grey - zipping up ${String(
      fns.length
    )} {bold Serverless} {italic handler} functions }`
  );
  await zipWebpackFiles(fns);
  console.log(
    chalk`{grey - all handlers zipped; ready for deployment ${emoji.thumbsUp}}`
  );

  console.log(
    chalk`- deploying {bold ${String(fns.length)} functions} to "${stage}" stage`
  );
  // const sandboxStage = stage === "dev" ? await sandbox(stage) : stage;
  // if (sandboxStage !== stage) {
  // }
  for (const fn of fns) {
    console.log(chalk.grey(`    - ${fn}`));
  }

  const promises: any[] = [];
  try {
    fns.map((fn) => {
      promises.push(
        asyncExec(
          `sls deploy function --force --aws-s3-accelerate --function ${fn} --stage ${stage}`
        )
      );
    });
    await Promise.all(promises);
    console.log(
      chalk`\n- all {bold ${String(fns.length)}} function(s) were deployed! ${
        emoji.rocket
      }\n`
    );
  } catch (error) {
    console.log(chalk`- {red {bold problems deploying functions!}} ${emoji.poop}`);
    console.log(`- ${error.message}`);
    console.log(chalk`- {dim ${error.stack}}`);
  }
}

async function fullDeploy(meta: IServerlessDeployMeta) {
  const { stage, config } = meta;
  console.log(
    chalk`- Starting {bold FULL serverless} deployment for {italic ${stage}} stage`
  );

  if (!hasDevDependency("serverless-webpack")) {
    console.log(
      chalk`{grey - checking timestamps to determine what {bold webpack} transpilation is needed}`
    );
    // const transpile = isTranspileNeeded(meta);

    // if (transpile.length > 0) {
    //   const build = (await import("../../commands/build/util/tools/webpack")).default({
    //     opts: { fns: transpile },
    //   }).build;
    //   await build();
    // }

    const fns = getLocalHandlerInfo().map((i) => i.fn);

    console.log(chalk`{grey - zipping up all ${String(fns.length)} Serverless handlers}`);

    await zipWebpackFiles(fns);
    console.log(
      chalk`{grey - all handlers zipped; ready for deployment ${emoji.thumbsUp}}`
    );
  }

  if (config.showUnderlyingCommands) {
    console.log(
      chalk`{grey > {italic sls deploy --aws-s3-accelerate  --stage ${stage} --verbose}}\n`
    );
    try {
      await asyncExec(`sls deploy --aws-s3-accelerate  --stage ${stage} --verbose`);
      console.log(chalk`\n- The full deploy was successful! ${emoji.rocket}\n`);
    } catch {
      console.log(chalk`- {red Error running deploy!}`);
      console.log(
        chalk`- NOTE: {dim if the error appears related to running out of heap memory then you can try {bold {yellow export NODE_OPTIONS=--max_old_space_size=4096}}}\n`
      );
    }
  }
}

/**
 * Manages the execution of a serverless deployment
 */
export default async function serverlessDeploy(argv: string[], opts: IDictionary) {
  const stage = await determineStage({ ...opts, interactive: true });
  if (!stage) {
    console.log(`- AWS stage could not be determined; try using "--stage" option`);
    process.exit();
  }

  const { deploy: config } = await getConfig();
  const meta: IServerlessDeployMeta = {
    stage,
    config: config as IDoDeployServerless,
    opts,
  };

  // argv values indicate function deployment
  await (argv.length > 0 ? functionDeploy(argv, meta) : fullDeploy(meta));
}
