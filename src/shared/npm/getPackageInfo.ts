import { asyncExec } from "async-shelljs";
import { INpmInfo } from "common-types";
import { DevopsError } from "~/errors";

/**
 * Calls on the network to get `yarn info [xxx]`;
 * if the package name is excluded then it just
 * looks for the local package and throws an error
 * if not found
 */
export async function getPackageInfo(pkg: string = "") {
  let npm: INpmInfo;
  try {
    npm = JSON.parse(await asyncExec("yarn info --json", { silent: true })).data;

    return npm;
  } catch (e) {
    // appears NOT to be a NPM package
    throw new DevopsError(
      pkg
        ? `The package ${pkg} does not exist in NPM.`
        : `The local package does not exist in NPM.`,
      `devops/does-not-exist`
    );
  }
}
