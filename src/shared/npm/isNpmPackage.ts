import { getPackageInfo } from "./index";

export async function isNpmPackage() {
  try {
    const npm = await getPackageInfo();
    return true;
  } catch (e) {
    return false;
  }
}
