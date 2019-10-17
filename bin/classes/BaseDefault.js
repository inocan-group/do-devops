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
const shared_1 = require("../shared");
/**
 * The base class for commands which have a configuration
 * component. This class defines the contract for creating
 * default values as well as providing some helper methods
 * for subclasses to leverage.
 */
class BaseDefault {
    /**
     * **findMissingConfigProperties**
     *
     * Validates that the configuration information from the file has all the properties that are
     * defined as defaultValues. The result is a list of properties which have a _default value_
     * but are missing from the current config file. This
     *
     * @param currentConfig the configuration for the specific command (from the config file)
     */
    findMissingConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            const currentConfig = (yield shared_1.getConfig())[this.command];
            const defaultValueKeys = Object.keys(this.defaultValues());
            const configFileKeys = Object.keys(currentConfig);
            return defaultValueKeys.reduce((acc, curr) => {
                if (!configFileKeys.includes(curr)) {
                    acc.push(curr);
                }
                return acc;
            }, []);
        });
    }
    /**
     * **fixMissingConfig**
     *
     * Finds and _adds_ all properties that are **not** in the current configuration file
     */
    fixMissingConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            const currentConfig = (yield shared_1.getConfig())[this.command];
            const missing = yield this.findMissingConfig();
            const defaultValues = this.defaultValues();
            const fixed = Object.assign(Object.assign({}, missing.reduce((acc, curr) => {
                acc[curr] = defaultValues[curr];
                return acc;
            }, {})), currentConfig);
        });
    }
}
exports.BaseDefault = BaseDefault;
