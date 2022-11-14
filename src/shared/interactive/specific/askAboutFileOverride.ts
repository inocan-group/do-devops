import chalk from "chalk";
import { spawnSync } from "node:child_process";
import { DoDevopObservation, Observations } from "src/@types";
import { getUserConfig } from "src/shared/config";
import { logger } from "src/shared/core";
import { getFileComponents, libraryDirectory, diffFiles } from "src/shared/file";
import { askListQuestion, askUserAboutEditorCommand } from "src/shared/interactive";
import { emoji } from "src/shared/ui";

export type FileAction = "show" | "diff" | "skip" | "copy";

const answers = {
  skip: "SKIP this file being from being copied",
  copy: "COPY the template file over repo's version",
  show: "SHOW both files in editor",
  diff: "Show DIFFERENCES between files in editor",
};

/**
 * If a file is being copied to a target location where the file already exists,
 * this interactive session will allow users to view the files and the _diff_ between
 * the files but ultimately they must decide between "copy" and "skip" which is translated
 * into a boolean flag where "copy" is true.
 */
export async function askAboutFileOverwrite(
  source: string,
  target: string,
  opts: Observations = new Set<DoDevopObservation>()
) {
  const parts = getFileComponents(source, libraryDirectory("templates"));
  const filename = `{dim ${parts.filepath}}{bold /${parts.filename}}`;
  const log = logger(opts);
  log.shout(`The file {blue ${filename}} already exists.\n`);
  let action: FileAction | undefined;
  while (action !== "copy" && action !== "skip") {
    action = await askListQuestion("What do you want to do?", answers);
    if (action === "show") {
      let editorCommand = getUserConfig().general?.editorCommand;
      if (!editorCommand) {
        editorCommand = await askUserAboutEditorCommand();
        if (editorCommand) {
          log.info(
            `- the editor command "${editorCommand}" has been saved to your user configuration.`
          );
          log.info(`{gray - the user config file is located at {blue src/.do-devops.json}}`);
        }
      }
      if (editorCommand) {
        try {
          spawnSync(editorCommand, [source, target, "&"], { stdio: "inherit" });
          log.info(`- check your editor for the two versions of the file`);
        } catch {
          log.info(`- ${emoji.poop} there was a problem opening the files in your editor`);
        }
      }
    }
    if (action === "diff") {
      diffFiles(source, target);
    }
  }

  return action === "copy" ? true : false;
}
