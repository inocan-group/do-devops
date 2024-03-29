/* eslint-disable unicorn/no-process-exit */
import chalk from "chalk";
import { DoDevopsHandler } from "src/@types/command";
import { getAwsIdentityFromProfile, getAwsProfileDictionary } from "src/shared/aws";
import { emoji } from "src/shared/ui";
import { askUser } from "../private";

export const handler: DoDevopsHandler<{ all: boolean }> = async ({ unknown: argv, opts }) => {
  const profiles = await getAwsProfileDictionary();
  const profileNames = Object.keys(profiles);
  let chosen: string[] = [];

  if (!profiles) {
    console.log(
      `- ${emoji.robot} you do not have ${chalk.italic`any`} AWS profiles in your credentials file!\n`
    );
    process.exit();
  }

  if (opts.all) {
    chosen = profileNames;
  } else if (argv.length === 0) {
    chosen = await askUser(Object.keys(profiles));
  } else {
    chosen = argv.filter((i) => profileNames.includes(i));
    if (chosen.length === 0) {
      console.log(`- there were {red no} valid profiles provided!`);
      console.log(`- valid profile names are: ${chalk.blue(profileNames.join(", "))}`);
    }
    if (chosen.length !== argv.length) {
      console.log(`- some profiles provided were not valid; valid ones are listed below`);
    }
  }

  const results = [];
  const errors = [];
  for (const profile of chosen) {
    try {
      results.push({ profile, ...(await getAwsIdentityFromProfile(profiles[profile])) });
      process.stdout.write(`{green .}`);
    } catch (error) {
      errors.push({ error, profile });
      process.stdout.write(`{red .}`);
    }
  }
  console.log();
  console.log(results);

  if (errors.length > 0) {
    console.log(
      `- there ${errors.length === 1 ? "was" : "were"} ${errors.length} profile${
        errors.length === 1 ? "" : "s"
      } which encountered errors trying to authenticate, the rest were fine.`
    );
    for (const e of errors) {
      console.log(
        `- ${chalk.bold.red(e.profile)}: ${chalk.grey((e as any)?.error?.message)}`
      );
    }
  }
};
