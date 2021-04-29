import chalk from "chalk";
import { asyncExec } from "async-shelljs";
import { emoji } from "~/shared/ui";
import { detectTarget } from "../../../_archive/deploy-helpers";
import { determineRegion, determineStage } from "~/shared/observations";
import { DoDevopsHandler } from "~/@types/command";
import { IPkgOptions } from "./pkg-meta";

/**
 * **Package Handler**
 *
 * The `package` command is used in **Serverless** projects to build all of
 * the _deployable_ assets but without actually deploying.
 */
export const handler: DoDevopsHandler<IPkgOptions> = async ({ opts }) => {
  // const { pkg } = await getConfig();
  const detect = await detectTarget();
  const target = detect.target;
  const stage = await determineStage(opts);
  const region = await determineRegion(opts);

  if (!target) {
    console.log(
      `  - ${emoji.poop} You must state a valid "target" [ ${
        target ? target + "{italic not valid}" : "no target stated"
      } ]`
    );
  }

  console.log(
    chalk`- {bold Serverless} {italic packaging} for {bold ${stage}} stage ${emoji.party}`
  );
  const command = `sls package --stage ${stage} --region ${region} ${
    opts.dir ? `--package ${opts.dir}` : ""
  }`;
  console.log(chalk`{dim {italic ${command}}}\n`);

  await asyncExec(command, { silent: opts.quiet ? true : false });
  const directory = opts.dir ? opts.dir : ".serverless";

  console.log(chalk`\n{bold {green - Packaging is complete!}} ${emoji.rocket}`);
  console.log(
    chalk`- the assets can all be found in the {italic {blue ${directory}} directory.}`
  );
  await asyncExec(`ls -l ${directory}`);
  if (opts.validate) {
    console.log(
      chalk`\n- validating the {bold cloudformation} {italic create} template ${emoji.eyeballs}`
    );

    const validateCmd = `aws cloudformation validate-template --template-body file://${directory}/cloudformation-template-create-stack.json`;
    try {
      console.log(chalk`{dim    ${validateCmd}}`);
      await asyncExec(validateCmd);
    } catch {
      console.log(chalk`{red - Error validating the {italic create} template!}`);
    }

    console.log(
      chalk`\n- validating the {bold cloudformation} {italic update} template ${emoji.eyeballs}`
    );

    const validateUpdate = `aws cloudformation validate-template --template-body file://${directory}/cloudformation-template-update-stack.json`;

    try {
      console.log(chalk`{dim    ${validateUpdate}}`);
      await asyncExec(validateUpdate);
    } catch {
      console.log(
        chalk`{red - Error validating the {italic update} template!} ${emoji.poop}`
      );
    }
  }

  // await runHooks(deploy.preDeployHooks);
};
