import { getPackageJson } from "./index";

export function exportsAsEsm() {
  return getPackageJson().type === "module";
}
