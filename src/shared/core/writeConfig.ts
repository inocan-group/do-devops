import { writeFileSync } from "fs";
import { IDoConfig } from "../../@types";
import { getConfigFilename } from "..";

/**
 * **writeConfig**
 *
 * Writes the `do-devops` config file to either the **project**'s root
 * or User's **home directory**.
 */
export function writeConfig(
  content: IDoConfig,
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
