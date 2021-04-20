import { getPackageInfo } from "./index";

export async function isNpmPackage() {
  try {
    await getPackageInfo();
    return true;
  } catch {
    return false;
  }
}
