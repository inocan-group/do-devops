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
const chalk_1 = __importDefault(require("chalk"));
const fs_1 = require("fs");
const index_1 = require("./index");
const cache = {
    user: undefined,
    project: undefined
};
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
 *
 * Note: if you opt to exit on the config file not being found you will
 * get a sensible message to the console and the process will exit.
 *
 * If you decide _not_ to exit then it return the configuration if found
 * but otherwise return `undefined`.
 */
function getConfig(callerOptions = {}) {
    return __awaiter(this, void 0, void 0, function* () {
        const options = Object.assign({
            projectOrUserConfig: "project",
            exitIfNotFound: true
        }, callerOptions);
        const filename = index_1.getConfigFilename(options.projectOrUserConfig);
        let config;
        if (!fs_1.existsSync(filename) && options.projectOrUserConfig === "project") {
            console.log(`- configuration file not found [ %s ]`, chalk_1.default.grey(process.env.PWD));
            index_1.writeDefaultConfig();
            console.log(`- default configuration was written to "%s" in project root`, chalk_1.default.bold.italic("do.config.js"));
        }
        try {
            config = yield Promise.resolve().then(() => __importStar(require(filename)));
            return config;
        }
        catch (e) {
            if (options.exitIfNotFound) {
                console.log("- \ud83d\udca9  Problem importing the config file [ %s ]: %s", filename, chalk_1.default.grey(e.message));
                console.log("- Either edit the file to the correct %s or delete the config and it will be recreated with the default values\n", chalk_1.default.italic("typing"));
                process.exit();
            }
            return;
        }
    });
}
exports.getConfig = getConfig;
