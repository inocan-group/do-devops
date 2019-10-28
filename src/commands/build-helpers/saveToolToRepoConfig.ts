import { BuildTool, IBuildTool } from "../../@types/defaultConfig";
import { getConfig, writeSection } from "../../shared/index";

/**
 * Saves a given _build tool_ as the default for the current
 * repo.
 */
export async function saveToolToRepoConfig(tool: IBuildTool) {
  const { build } = await getConfig();
  if (build.buildTool !== tool) {
    build.buildTool = tool;
    await writeSection("build", build);
  }
}
