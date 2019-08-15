"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const isServerless_1 = require("./isServerless");
/**
 * Returns a boolean flag on whether or not this project appears to be
 * based on the `typescript-microservice` yeoman template.
 */
function isTypescriptMicroserviceProject() {
    const status = isServerless_1.isServerless();
    return status && status.isUsingTypescriptMicroserviceTemplate ? true : false;
}
exports.isTypescriptMicroserviceProject = isTypescriptMicroserviceProject;
