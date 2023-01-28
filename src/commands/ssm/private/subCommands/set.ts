/* eslint-disable unicorn/no-process-exit */
import { getAwsProfile, getAwsIdentityFromProfile } from "src/shared/aws";
import { SSM } from "aws-ssm";
import { completeSsmName } from "../index";
import { toBase64 } from "native-dash";
import { determineProfile, determineRegion } from "src/shared/observations";
import { askForStage } from "src/shared/serverless";
import { emoji } from "src/shared/ui";
import { DoDevopsHandler } from "src/@types";
import { ISsmOptions } from "../../parts";
import chalk from "chalk";

export const execute: DoDevopsHandler<ISsmOptions> = async ({ opts, unknown: argv }) => {
  if (argv.length < 2) {
    console.log(
      `The "dd ssm set" command expects the variable name and value as parameters on the command line: ${chalk.blue.bold`do ssm set`} <${chalk.italic`name`}> <${chalk.italic`value`}>\n`
    );
    console.log(
      chalk.gray`${chalk.bold` - Note:`} you can include a ${chalk.italic`partial name`} for the variable and things like the AWS profile, region, stage, and version number\n  will be filled in where possible\n`
    );

    process.exit(1);
  }

  let [name, value] = argv;
  const profile = await determineProfile({ ...opts, interactive: true });
  if (!profile) {
    console.log(
      `- Couldn't determine the AWS Profile; try setting it manually with {inverse  --profile }.`
    );
    console.log(
      `- alternatively use the ${chalk.inverse` --interactive `} option to have the CLI interactively let you select`
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
      `SSM variables should be namespaced to a STAGE, what stage are you setting for ${chalk.dim`[ profile: ${chalk.italic(profile)}, region: ${chalk.italic(region)}, account: ${chalk.italic(identity.accountId)} ]`}?`
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
      `\n- ${emoji.party} the {bold {yellow ${name}}} variable was set successfully to the ${chalk.italic(region)} region ${chalk.dim`[ profile: ${chalk.italic(profile)}, region: ${chalk.italic(region)}, account: ${chalk.italic(identity.accountId)} ]`}\n`
    );
  } catch (error) {
    console.log();
    if ((error as any)?.code === "ParameterAlreadyExists") {
      console.log(
        `- {red {bold Parameter Already Exists!}} to overwrite a parameter which already exists you must add ${chalk.blue`--force`} to the CLI command`
      );
    } else {
      console.log(`${chalk.red.bold`Error:`} ${(error as Error).message}`);
    }

    console.log();
    process.exit(1);
  }
};
