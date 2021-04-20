import { getAwsProfile, getAwsIdentityFromProfile } from "~/shared/aws";
import chalk from "chalk";
import { SSM } from "aws-ssm";
import { completeSsmName } from "../index";
import { ISsmOptions } from "../../public";
import { toBase64 } from "native-dash";
import { determineProfile, determineRegion } from "~/shared/observations";
import { askForStage } from "~/shared/serverless";
import { emoji } from "~/shared/ui";

export async function execute(argv: string[], options: ISsmOptions) {
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
  const profile = await determineProfile({ cliOptions: options, interactive: true });
  const profileInfo = await getAwsProfile(profile);
  const identity = await getAwsIdentityFromProfile(profileInfo);
  const region =
    options.region ||
    profileInfo.region ||
    (await determineRegion({ cliOptions: options }));
  const stage =
    options.stage ||
    process.env.AWS_STAGE ||
    process.env.NODE_ENV ||
    (await askForStage(
      chalk`SSM variables should be namespaced to a STAGE, what stage are you setting for {dim [ profile: {italic ${profile}}, region: {italic ${region}}, account: {italic ${identity.accountId}} ]}?`
    ));

  const ssm = new SSM({ profile, region });
  name = await completeSsmName(name, { stage });
  if (options.base64) {
    value = toBase64(value);
  }
  process.env.AWS_STAGE = stage;

  try {
    await ssm.put(name, value, {
      description: options.description,
      override: options.force,
    });
    console.log(
      chalk`\n- ${emoji.party} the {bold {yellow ${name}}} variable was set successfully to the {italic ${region}} region {dim [ profile: {italic ${profile}}, region: {italic ${region}}, account: {italic ${identity.accountId}} ]}\n`
    );
  } catch (error) {
    console.log();
    if (error.code === "ParameterAlreadyExists") {
      console.log(
        chalk`- {red {bold Paramater Already Exists!}} to overwrite a parameter which already exists you must add {blue --force} to the CLI command`
      );
    } else {
      console.log(chalk`{red {bold Error:}} ${error.message}`);
    }

    console.log();
    process.exit(1);
  }
}
