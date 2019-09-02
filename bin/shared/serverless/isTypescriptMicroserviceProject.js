"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const isServerless_1 = require("./isServerless");
/**
 * Returns a boolean flag on whether or not this project appears to be
 * based on the `typescript-microservice` yeoman template.
 */
function isTypescriptMicroserviceProject() {
    return __awaiter(this, void 0, void 0, function* () {
        const status = yield isServerless_1.isServerless();
        return status && status.isUsingTypescriptMicroserviceTemplate ? true : false;
    });
}
exports.isTypescriptMicroserviceProject = isTypescriptMicroserviceProject;
