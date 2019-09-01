import * as path from "path";
import { homedir } from "os";
/**
 * Gets the filename for the `do.config.js` file. You can state whether you
 * want the config file associated to the current _project_ (the default), or
 * instead the user's config file (in their home directory)
 */
export function getConfigFilename(
  projectOrUser: "project" | "user" = "project"
) {
  return projectOrUser === "project"
    ? `${process.env.PWD}/do.config.js`
    : `${homedir()}/do.config.js`;
}
