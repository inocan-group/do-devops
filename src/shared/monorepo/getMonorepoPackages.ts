import { Observations } from "~/@types";
import path from "path";
import { readYamlConfig } from "../file/crud/readYamlConfig";
import globby from "globby";

export function getMonorepoPackages(o: Observations, dir?: string) {
  dir = dir ? dir : process.cwd();
  if (o.has("pnpmWorkspaces")) {
    const workspace = readYamlConfig<{ packages: string[] }>(path.join(dir, "pnpm-workspace.yaml"));
    const dirs = workspace ? globby(workspace.packages) : [];
    // TODO: finish this ... not expected to work yet
    console.log(dirs);

  }
}