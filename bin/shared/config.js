"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const chalk_1 = __importDefault(require("chalk"));
const writeDefaultConfig_1 = require("./writeDefaultConfig");
const defaults = __importStar(require("../commands/defaults"));
/**
 * **getConfigFilename**
 *
 * returns the path to the configuration filename
 */
function getConfigFilename() {
    return `${process.env.PWD}/do.config.js`;
}
exports.getConfigFilename = getConfigFilename;
/**
 * **getCurrentConfig**
 *
 * returns the current configuration as a `IDoConfig` object
 */
function getCurrentConfig() {
    console.log("config filename:", getConfigFilename());
    return JSON.parse(fs_1.readFileSync(getConfigFilename(), { encoding: "utf-8" }));
}
exports.getCurrentConfig = getCurrentConfig;
/**
 * **getConfigSectionNames**
 *
 * returns a list of configuration section names; this includes
 * the `global` section.
 */
function getConfigSectionNames() {
    return Object.keys(defaults).filter((section) => {
        return typeof defaults[section] === "function";
    });
}
exports.getConfigSectionNames = getConfigSectionNames;
/**
 * **getDefaultForConfigSection**
 *
 * returns the default config for a given section
 */
function getDefaultForConfigSection(section) {
    return defaults[section]();
}
exports.getDefaultForConfigSection = getDefaultForConfigSection;
function askUserForConfigDefaults(section) {
    return __awaiter(this, void 0, void 0, function* () { });
}
exports.askUserForConfigDefaults = askUserForConfigDefaults;
/**
 * **getDefaultConfig**
 *
 * Returns the full _default_ configuration; use `getConfigSection()` if you
 * only want a particular section.
 */
function getDefaultConfig() {
    return getConfigSectionNames().reduce((acc, section) => {
        acc = Object.assign({}, acc, { [section]: getDefaultForConfigSection(section) });
        return acc;
    }, {});
}
exports.getDefaultConfig = getDefaultConfig;
/**
 * **getConfig**
 *
 * Gets the current configuration based on the `do.config.js` file.
 * This will include global as well as command-specific configuration.
 *
 * The _command-specific_ config should be stored off the root of
 * the configuration with the same name as the command. The _global_
 * config is stored off the root config on the property of `global`.
 * This allows for consumers of this function to isolate like so:
 *
```typescript
const { global, myCommand } = await getConfig();
```
 */
function getConfig() {
    return __awaiter(this, void 0, void 0, function* () {
        const filename = getConfigFilename();
        let config;
        if (!fs_1.existsSync(filename)) {
            console.log(`- configuration file not found [ %s ]`, chalk_1.default.grey(process.env.PWD));
            writeDefaultConfig_1.writeWholeFile();
            console.log(`- default configuration was written to "%s" in project root`, chalk_1.default.bold.italic("do.config.js"));
        }
        try {
            config = yield Promise.resolve().then(() => __importStar(require(filename)));
            return config;
        }
        catch (e) {
            console.log("- \ud83d\udca9  Problem importing the config file [ %s ]: %s", filename, chalk_1.default.grey(e.message));
            console.log("- Either edit the file to the correct %s or delete the config and it will be recreated with the default values\n", chalk_1.default.italic("typing"));
            process.exit();
        }
    });
}
exports.getConfig = getConfig;
