"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const os_1 = require("os");
/**
 * Gets the filename for the `do.config.js` file. You can state whether you
 * want the config file associated to the current _project_ (the default), or
 * instead the user's config file (in their home directory)
 */
function getConfigFilename(projectOrUser = "project") {
    return projectOrUser === "project"
        ? `${process.env.PWD}/do.config.js`
        : `${os_1.homedir()}/do.config.js`;
}
exports.getConfigFilename = getConfigFilename;
