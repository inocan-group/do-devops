import chalk from "chalk";
import { asyncExec } from "async-shelljs";
import { emoji } from "src/shared/ui";
import { determineRegion, determineStage } from "src/shared/observations";
import { DoDevopsHandler } from "src/@types/command";
import { IPkgOptions } from "./pkg-meta";

/**
 * **Package Handler**
 *
 * The `package` command is used in **Serverless** projects to build all of
 * the _deployable_ assets but without actually deploying.
 */
export const handler: DoDevopsHandler<IPkgOptions> = async ({ opts, observations }) => {
  const stage = await determineStage(opts);
  const region = await determineRegion(opts);

  if (!observations.has("serverlessFramework")) {
    console.log(
      `  - the {bold pkg} command is only intended for use in repos that use the Serverless framework\n`
    );
    return;
  }

  console.log(
    `- ${chalk.bold`Serverless`} ${chalk.italic`packaging`} for {bold ${stage}} stage ${emoji.party}`
  );
  const command = `sls package --stage ${stage} --region ${region} ${
    opts.dir ? `--package ${opts.dir}` : ""
  }`;
  console.log(chalk.dim.italic`${command}\n`);

  await asyncExec(command, { silent: opts.quiet ? true : false });
  const directory = opts.dir ?? ".serverless";

  console.log(`\n{bold {green - Packaging is complete!}} ${emoji.rocket}`);
  console.log(`- the assets can all be found in the ${chalk.italic.blue`${directory}} directory.}`}`);
  await asyncExec(`ls -l ${directory}`);
  if (opts.validate) {
    console.log(
      `\n- validating the ${chalk.bold`cloudformation`} ${chalk.italic`create`} template ${emoji.eyeballs}`
    );

    const validateCmd = `aws cloudformation validate-template --template-body file://${directory}/cloudformation-template-create-stack.json`;
    try {
      console.log(chalk.dim`   ${validateCmd}`);
      await asyncExec(validateCmd);
    } catch {
      console.log(`{red - Error validating the ${chalk.italic`create`} template!}`);
    }

    console.log(
      `\n- validating the {bold cloudformation} ${chalk.italic`update`} template ${emoji.eyeballs}`
    );

    const validateUpdate = `aws cloudformation validate-template --template-body file://${directory}/cloudformation-template-update-stack.json`;

    try {
      console.log(chalk.dim`   ${validateUpdate}`);
      await asyncExec(validateUpdate);
    } catch {
      console.log(chalk.red`- Error validating the ${chalk.italic` update`} template! ${emoji.poop}`);
    }
  }

  // await runHooks(deploy.preDeployHooks);
};
