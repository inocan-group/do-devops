import { writeFileSync } from "fs";
import { IProjectConfigFilled, IUserConfigFilled } from "~/@types";
import { write } from "~/shared/file";
import { getConfigFilename } from "./index";

/**
 * **writeConfig**
 *
 * Writes the `do-devops` config file to either the **project**'s root
 * or User's **home directory**.
 */
export function writeConfig(
  content: IProjectConfigFilled | IUserConfigFilled,
  projectOrUserConfig: "user" | "project" = "project"
) {
  const filename = getConfigFilename(projectOrUserConfig);
  writeFileSync(
    filename,
    "const config = " + JSON.stringify(content, null, 2) + ";\nmodule.exports = config;",
    {
      encoding: "utf-8",
    }
  );
}

export function writeProjectConfig(content: IProjectConfigFilled) {
  write(JSON.stringify(content), "./.do-devops.json");
}
