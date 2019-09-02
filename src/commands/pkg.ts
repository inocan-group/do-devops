import {
  getConfig,
  runHooks,
  emoji,
  determineStage,
  determineRegion
} from "../shared";
import { OptionDefinition } from "command-line-usage";
import { IDictionary } from "common-types";
import { detectTarget } from "./deploy-helpers";
import chalk from "chalk";
import { asyncExec } from "async-shelljs";

export async function description(opts: IDictionary) {
  return chalk`Package up resources for {bold Serverless} publishing but do not actually {italic deploy}.`;
}

export const options: OptionDefinition[] = [
  {
    name: "dir",
    alias: "d",
    type: String,
    typeLabel: "<directory>",
    group: "pkg",
    description: chalk`by default assets are saved to the {italic .serverless} directory but you can change this to a different directory if you like.`
  },
  {
    name: "validate",
    type: Boolean,
    group: "pkg",
    description: chalk`after the package is completed the {bold cloudformation} template can be validated`
  }
];

export const syntax = "do package <options>";

/**
 * **Package Handler**
 *
 * The `package` command is used in **Serverless** projects to build all of
 * the _deployable_ assets but without actually deploying.
 */
export async function handler(argv: string[], opts: any) {
  const { pkg } = await getConfig();
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
    } catch (e) {
      console.log(
        chalk`{red - Error validating the {italic create} template!}`
      );
    }

    console.log(
      chalk`\n- validating the {bold cloudformation} {italic update} template ${emoji.eyeballs}`
    );

    const validateUpdate = `aws cloudformation validate-template --template-body file://${directory}/cloudformation-template-update-stack.json`;

    try {
      console.log(chalk`{dim    ${validateUpdate}}`);
      await asyncExec(validateUpdate);
    } catch (e) {
      console.log(
        chalk`{red - Error validating the {italic update} template!} ${emoji.poop}`
      );
    }
  }

  // await runHooks(deploy.preDeployHooks);
}
