import { DevopsError } from "~/errors";
import { getPackageJson } from "./index";

/**
 * Returns a boolean flag to indicate whether the `package.json`
 * is claiming this package to be a **ES** module or just plain
 * old **CJS** module.
 *
 * This is determined via the `type` property
 * and your mileage with this may vary depending on your module
 * building strategy and what stage of the build process your
 * looking to test for.
 */
export function exportsAsEsm() {
  const pkg = getPackageJson();
  if (!pkg) {
    throw new DevopsError(
      `While checking package.json for the "type" of module, the package.json was not found!`,
      "not-ready/missing-package-json"
    );
  }
  return pkg.type === "module";
}
