import { IProjectConfig, DoDevopObservation, TestObservation } from "~/@types";

/**
 * Determines the unit testing framework being used in the current
 * working directory. If it can not determine then it will return `false`.
 */
export function determineTestingFramework(
  observations: DoDevopObservation[],
  config?: IProjectConfig
): TestObservation | false {
  const known: TestObservation[] = ["ava", "jasmine", "jest", "mocha", "qunit", "uvu"];
  for (const fw of known) {
    if (observations.includes(fw)) {
      return fw;
    }
  }

  return config && config.projectConfig && config.test?.unitTestFramework
    ? config.test.unitTestFramework
    : false;
}
