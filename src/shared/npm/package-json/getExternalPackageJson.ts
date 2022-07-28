import { asyncExec } from "async-shelljs";
import { INpmInfo } from "common-types";
import parse from "destr";
import { DevopsError } from "src/errors";

/**
 * Calls on the network to get `yarn info [xxx]`;
 * if the package name is excluded then it just
 * looks for the local package and throws an error
 * if not found
 */
export async function getExternalPackageJson(pkg: string = ""): Promise<INpmInfo> {
  try {
    return parse(await asyncExec(`npm info ${pkg} --json`, { silent: true })) as INpmInfo;
  } catch {
    // appears NOT to be a NPM package
    throw new DevopsError(
      pkg
        ? `The package ${pkg} does not exist in NPM.`
        : "The local package does not exist in NPM.",
      "devops/does-not-exist"
    );
  }
}
