import { saveUserConfig } from "~/shared/config";
import { askListQuestion } from "~/shared/interactive";
import { askInputQuestion } from "../general/askInputQuestion";

/**
 * Asks the user for a command to run to open files in the
 * user's editor of choice.
 *
 * The setting will be saved in the user config file and
 * returned to the caller.
 */
export async function askUserAboutEditorCommand() {
  let editor = await askListQuestion<string>("What editor command should we use to open files?", [
    { name: "vs-code (using 'code' to open)", value: "code", short: "vs-code" },
    { name: "vim", value: "vim" },
    { name: "Sublime Text (using 'subl' to open)", value: "subl", short: "sublime" },
    { name: "other", value: "other" },
  ]);
  if (editor === "other") {
    editor = await askInputQuestion("what is the command for this editor?");
  }
  if (editor) {
    saveUserConfig({ general: { editorCommand: editor } });
  }

  return editor;
}
