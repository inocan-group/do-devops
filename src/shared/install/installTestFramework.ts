import chalk from "chalk";
import { TestObservation, Observations, Options } from "src/@types";
import { DevopsError } from "src/errors";
import { logger } from "src/shared/core";
import { installDevDep } from "src/shared/npm";

export async function installTestFramework(
  framework: TestObservation,
  opts: Options,
  observations: Observations
) {
  const log = logger(observations);

  let installed: boolean;
  switch (framework) {
    case "uvu":
      installed = await installDevDep(opts, observations, "uvu", "ts-node");
      break;
    case "jest":
      installed = await installDevDep(
        opts,
        observations,
        "jest",
        "ts-jest",
        "@types/jest",
        "jest-extended"
      );
      break;
    case "mocha":
      installed = await installDevDep(
        opts,
        observations,
        "mocha",
        "chai",
        "@types/mocha",
        "@types/chai",
        "ts-node"
      );
      break;
    case "jasmine":
      installed = await installDevDep(opts, observations, "jasmine");
      break;
    case "qunit":
      installed = await installDevDep(opts, observations, "qunit");
      break;
    case "ava":
      installed = await installDevDep(opts, observations, "ava");
      break;
    default:
      throw new DevopsError(
        `Unknown test framework: ${framework}`,
        "install/unknown-test-framework"
      );
  }

  if (installed) {
    log.whisper(
      chalk`{gray - installed all {italic dev dependencies} for {bold {green ${framework}}}}`
    );
  }

  return installed;
}
