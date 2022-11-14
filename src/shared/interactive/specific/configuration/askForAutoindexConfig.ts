import chalk from "chalk";
import { exit } from "node:process";
import { Options, Observations } from "src/@types";
import { IAutoindexOptions } from "src/commands/autoindex/parts";
import { getProjectConfig, saveProjectConfig } from "src/shared/config";
import { logger } from "src/shared/core";
import { askConfirmQuestion, askInputQuestion } from "src/shared/interactive";
import { emoji } from "src/shared/ui";

export async function askForAutoindexConfig(opts: Options<IAutoindexOptions>, o: Observations) {
  const log = logger(opts);
  const projectConfig = getProjectConfig();
  const hasProjectConfig = projectConfig.autoindex !== undefined;

  if (o.has("monorepo")) {
    log.info(
      `- ${emoji.eyeballs} this project is a monorepo; you should configure 'packages' in your monorepo separately.`
    );
    const continueOn = await askConfirmQuestion(
      "You can still configure the root of the monorepo if there are index files, {italic not} in the individual packages. Otherwise there is no point. Shall we continue?"
    );
    if (!continueOn) {
      exit(0);
    }
  }

  log.info(
    `- configuring this project for {bold {yellow do-devops}}'s {blue autoindex} command\n`
  );
  if (hasProjectConfig) {
    log.info(`- ${emoji.eyeballs} has existing project configuration to work from`);
  }

  let indexGlobs = ["**/index.ts", "**/index.js", "**/index.mjs", "!**/*.d.ts", "!**/node_modules"];

  const confirmIndexGlob = await askConfirmQuestion(
    `By default, the files which are identified as possible "autoindex" files are: ${chalk.dim( JSON.stringify(indexGlobs))}. This is typically fine, shall we proceed with this or do you want to modify this?`
  );
  if (!confirmIndexGlob) {
    console.log(`- input patterns in a CSV format that can be parsed.`);
    console.log(`  for example {dim [ "**foobar.ts" ] }.`);
    console.log(
      `- Note: you should NOT include the exclusion pattern for {blue node_modules} as this will always be included`
    );

    indexGlobs = [
      ...(JSON.parse(await askInputQuestion(`pattern:`)) as string[]),
      "!**/node_modules",
    ];
  }

  let whitelistGlobs = projectConfig?.autoindex?.whitelistGlobs || undefined;
  let blacklistGlobs = projectConfig?.autoindex?.blacklistGlobs || [];

  const confirmWhitelist =
    whitelistGlobs === undefined
      ? await askConfirmQuestion(
          `- you ${chalk.italic("can")} specify a particular whitelist -- or set of whitelists -- to identify files to be included in index files but typically you should leave as the default which is to include all JS and TS files. Continue without setting explicit whitelist?`
        )
      : await askConfirmQuestion(
          `- you have whitelists currently in your configuration; can we keep these {italic as is}?`
        );

  if (!confirmWhitelist) {
    console.log(`- whitelists should be in a CSV format that can be parsed.`);
    console.log(`  for example ${chalk.dim(` [ "**foobar.ts" ] `)}.`);

    whitelistGlobs = JSON.parse(await askInputQuestion(`pattern:`)) as string[];
  }

  const confirmBlacklist = blacklistGlobs
    ? !(await askConfirmQuestion(
        `- currently you have no files "blacklisted". Do you want to add any?`,
        { default: false }
      ))
    : await askConfirmQuestion(
        `- you have blacklists in your configuration; can we keep these {italic as is}?`
      );

  if (!confirmBlacklist) {
    console.log(`- blacklists should be in a CSV format that can be parsed.`);
    console.log(`  for example ${chalk.dim( [ "**foobar.ts" ])}.`);

    blacklistGlobs = JSON.parse(await askInputQuestion(`pattern:`)) as string[];
  }

  const sfc = o.has("vue") ? true : false;

  await saveProjectConfig({
    autoindex: {
      indexGlobs,
      whitelistGlobs,
      blacklistGlobs,
      sfc,
    },
  });

  log.info(`- ${emoji.party} configuration for {blue autoindex} has been saved to project`);
}
