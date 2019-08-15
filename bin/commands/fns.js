"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const shared_1 = require("../shared");
function handler(args, opt) {
    return __awaiter(this, void 0, void 0, function* () {
        const status = shared_1.isServerless();
        if (!status) {
            console.log("- this project does not appear to be a Serverless project!\n");
            process.exit();
        }
        else if (status.isUsingTypescriptMicroserviceTemplate) {
            // await rebuildTypescriptMicroserviceProject();
        }
        try {
            const functions = (yield shared_1.getServerlessYaml()).functions;
        }
        catch (e) {
            console.log(`- Error finding functions: ${e.message}\n`);
            process.exit();
        }
        // const inlineFns = await findInlineFunctionDefnFiles();
        // const configFiles = await findConfigFunctionDefnFiles();
        // console.log(inlineFns);
        // console.log(configFiles);
        // for await (const fn of inlineFns) {
        //   console.log(fn, fn.replace(process.env.PWD, ""));
        //   const e = await getExportsFromFile(fn);
        //   console.log(e);
        // }
    });
}
exports.handler = handler;
