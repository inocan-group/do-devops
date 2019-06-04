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
const fast_glob_1 = __importDefault(require("fast-glob"));
const path_1 = __importDefault(require("path"));
const fs_1 = require("fs");
/**
 * **findFunctionConfigurations**
 *
 * Looks through `${PWD}/src` directory to find `*.defn.ts` files which will be registered
 * as serverless configuration files.
 *
 * @param basePath you can optionally express where to start looking for config files
 * instead of the default of `${PWD}/src`
 */
function findFunctionConfigurations(basePath) {
    const glob = path_1.default.join(basePath, "**/*.defn.ts") ||
        path_1.default.join(process.env.PWD, "/src/**/*.defn.ts");
    return fast_glob_1.default.sync([glob]);
}
exports.findFunctionConfigurations = findFunctionConfigurations;
function createFunctionDictionary(rootPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const root = rootPath || process.env.PWD;
        const fns = findFunctionConfigurations(rootPath || path_1.default.join(process.env.PWD, "/src"));
        const serverlessNameLookup = getNamespacedLookup(fns, root);
        const { valid, invalid } = yield validateExports(fns);
        return fns.map(filePath => {
            return {
                filePath,
                fileDir: getFilePath(filePath),
                relativePath: reduceToRelativePath(root, filePath),
                validHandlerDefinition: valid.includes(filePath),
                configFilename: getFilenameWithoutExtension(filePath) + ".def.ts",
                fnFilename: getFilenameWithoutExtension(filePath) + ".ts",
                serverlessFn: serverlessNameLookup[filePath]
            };
        });
    });
}
exports.createFunctionDictionary = createFunctionDictionary;
/**
 * **writeServerlessFunctionExports**
 *
 * writes all serverless function definition/configurations to the
 * `serverless-config/functions.ts` file. This file will not only
 * export all function definitions but will also provide a typescript
 * **type** called `IDefinedServerlessFunction` which will be a set of
 * string names which are defined in the given repo
 *
 * @param basePath you may alternatively state a base file path to use
 * when looking for function definition files (aka, files named `*.defn.ts`)
 * @param output rather than exporting to the file `serverless-config/functions.ts` you
 * may state an alternative
 */
function writeServerlessFunctionExports(basePath = undefined, output = undefined) {
    return __awaiter(this, void 0, void 0, function* () {
        const root = basePath || process.env.PWD;
        const outputFilename = output || path_1.default.join(process.env.PWD, "/serverless-config/functions.ts");
        const functionDefns = findFunctionConfigurations(basePath).map(p => reduceToRelativePath(root, p));
        const dict = yield createFunctionDictionary(basePath);
        let template = `##imports##\n\n##exports##\n\n##interface##`;
        template = template.replace("##imports##", dict
            .map(i => `${i.validHandlerDefinition
            ? `import ${i.serverlessFn} from '.${i.relativePath.replace(".ts", "")}';`
            : `// invalid handler definition for "${i.serverlessFn}"; please check handler definition and then rebuild `}`)
            .join("\n"));
        template = template.replace("##exports##", dict
            .filter(i => i.validHandlerDefinition)
            .map(i => `export { ${i.serverlessFn} };`)
            .join("\n"));
        template = template.replace("##interface##", `export type IDefinedServerlessFunction = ` +
            dict
                .filter(i => i.validHandlerDefinition)
                .map(i => `'${i.serverlessFn}'`)
                .join(" | "));
        fs_1.writeFileSync(outputFilename, "/**\n * DO NOT CHANGE THIS FILE\n * (this file is automatically created)\n **/\n\n" +
            template);
    });
}
exports.writeServerlessFunctionExports = writeServerlessFunctionExports;
/**
 * **reduceToRelativePath**
 *
 * Reduces the file path to just the relative path _beyond_ the passed in `root` path
 */
function reduceToRelativePath(root, fullyQualifiedPath) {
    return fullyQualifiedPath.replace(root, "");
}
exports.reduceToRelativePath = reduceToRelativePath;
/**
 * **getFilePath**
 *
 * given a filepath, this function strips off the filename and returns just
 * the path which the file resides in.
 */
function getFilePath(filePath) {
    const parts = filePath.split("/");
    return parts.slice(0, parts.length - 1).join("/");
}
exports.getFilePath = getFilePath;
/**
 * **getFilenameWithoutExtension**
 *
 * Given a path, filename, and extension (including `.def.ts` as an extension type);
 * this function will return just the filename component.
 */
function getFilenameWithoutExtension(filePath) {
    return filePath
        .split("/")
        .pop()
        .split(".")[0];
}
exports.getFilenameWithoutExtension = getFilenameWithoutExtension;
/**
 * **validateExports**
 *
 * Given an array of file imports, returns a hash of `valid` and `invalid`
 * files based on whether they represent a valid Lambda Serverless handler
 * definition.
 */
function validateExports(fnDefns) {
    return __awaiter(this, void 0, void 0, function* () {
        const valid = [];
        const invalid = [];
        for (const fn of fnDefns) {
            try {
                const imp = yield Promise.resolve().then(() => __importStar(require(fn)));
                if (imp.default && Object.keys(imp.default).includes("handler")) {
                    valid.push(fn);
                }
                else {
                    invalid.push(fn);
                }
            }
            catch (e) {
                invalid.push(fn);
            }
        }
        return { valid, invalid };
    });
}
exports.validateExports = validateExports;
/**
 * **getNamespacedFilename**
 *
 * Directories off of the "root/base" should be considered a "namespace" so that
 * function names do not collide as well as to ensure that a functions "context"
 * if fully captured by the name. For this reason a handler function named
 * `netlify/deployWebhook.ts` will be resolved to `service-name-[stage]-netlifyDeployWebhook`.
 *
 * This function is reponsible for providing a lookup hash who's keys are
 * the passed in
 */
function getNamespacedLookup(fns, basePath) {
    const root = basePath ? path_1.default.resolve(basePath) : path_1.default.join(process.env.PWD, "/src");
    return fns.reduce((acc, fn) => {
        const parts = fn
            .replace(root, "")
            .split("/")
            .filter(i => i);
        parts[parts.length - 1] = parts[parts.length - 1].replace(".defn.ts", "");
        acc[fn] = parts
            .map((p, i) => (i === 0 ? p : p.slice(0, 1).toUpperCase() + p.slice(1)))
            .join("");
        return acc;
    }, {});
}
exports.getNamespacedLookup = getNamespacedLookup;
/**
 * **getFunctionNames**
 *
 * Given a set of paths to function definition files, will return a
 * lookup hash which provides the "function name" as the output
 */
function getFunctionNames(paths) {
    return paths.reduce((acc, current) => {
        const filename = current
            .split("/")
            .pop()
            .replace(".defn.ts", "");
        acc[current] = filename;
        return acc;
    }, {});
}
exports.getFunctionNames = getFunctionNames;
function detectDuplicateFunctionDefinitions(lookup) {
    const vals = Object.values(lookup);
    const found = [];
    const dups = [];
    vals.forEach(fn => {
        if (!dups.map(i => i.fn).includes(fn)) {
            const locations = Object.keys(lookup).reduce((acc, curr) => {
                if (lookup[curr] === fn) {
                    acc.push(curr);
                }
                return acc;
            }, []);
            if (locations.length > 1) {
                dups.push({
                    fn,
                    message: `- ${"\uD83D\uDE21" /* angry */}  the function "${fn}" is defined more than once [ ${locations.length} ]: ${locations.join(", ")}`,
                    locations
                });
            }
        }
    });
    return dups;
}
exports.detectDuplicateFunctionDefinitions = detectDuplicateFunctionDefinitions;
function functionList() {
    //
}
exports.functionList = functionList;
