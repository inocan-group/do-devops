import { getAwsProfile, getAwsIdentityFromProfile } from "src/shared/aws";
import chalk from "chalk";
import { SSM } from "aws-ssm";
import { completeSsmName } from "../index";
import { toBase64 } from "native-dash";
import { determineProfile, determineRegion } from "src/shared/observations";
import { askForStage } from "src/shared/serverless";
import { emoji } from "src/shared/ui";
import { DoDevopsHandler } from "src/@types";
import { ISsmOptions } from "../../parts";

export const execute: DoDevopsHandler<ISsmOptions> = async ({ opts, unknown: argv }) => {
  if (argv.length < 2) {
    console.log(
      chalk`The "dd ssm set" command expects the variable name and value as parameters on the command line: {blue {bold do ssm set} <{italic name}> <{italic value}>}\n`
    );
    console.log(
      chalk`{grey {bold - Note:} you can include a {italic partial name} for the variable and things like the AWS profile, region, stage, and version number\n  will be filled in where possible}\n`
    );

    process.exit(1);
  }

  let [name, value] = argv;
  const profile = await determineProfile({ ...opts, interactive: true });
  if (!profile) {
    console.log(
      chalk`- Couldn't determine the AWS Profile; try setting it manually with {inverse  --profile }.`
    );
    console.log(
      chalk`- alternatively use the {inverse --interactive } option to have the CLI interactively let you select`
    );
    process.exit();
  }
  const profileInfo = await getAwsProfile(profile);
  const identity = await getAwsIdentityFromProfile(profileInfo);
  const region = opts.region || profileInfo.region || (await determineRegion(opts));
  const stage =
    opts.stage ||
    process.env.AWS_STAGE ||
    process.env.NODE_ENV ||
    (await askForStage(
      chalk`SSM variables should be namespaced to a STAGE, what stage are you setting for {dim [ profile: {italic ${profile}}, region: {italic ${region}}, account: {italic ${identity.accountId}} ]}?`
    ));

  const ssm = new SSM({ profile, region });
  name = await completeSsmName(name, { stage });
  if (opts.base64) {
    value = toBase64(value);
  }
  process.env.AWS_STAGE = stage;

  try {
    await ssm.put(name, value, {
      description: opts.description,
      override: opts.force,
    });
    console.log(
      chalk`\n- ${emoji.party} the {bold {yellow ${name}}} variable was set successfully to the {italic ${region}} region {dim [ profile: {italic ${profile}}, region: {italic ${region}}, account: {italic ${identity.accountId}} ]}\n`
    );
  } catch (error) {
    console.log();
    if ((error as any)?.code === "ParameterAlreadyExists") {
      console.log(
        chalk`- {red {bold Paramater Already Exists!}} to overwrite a parameter which already exists you must add {blue --force} to the CLI command`
      );
    } else {
      console.log(chalk`{red {bold Error:}} ${(error as Error).message}`);
    }

    console.log();
    process.exit(1);
  }
};
