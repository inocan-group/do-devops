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
const getServerlessYaml_1 = require("./getServerlessYaml");
/**
 * Determines the appropriate `region` to point at for the **sls** command.
 * This is based on config, CLI options, and the Serverless configuration.
 *
 * @param opts the CLI options which were used
 */
function getRegion(opts) {
    return __awaiter(this, void 0, void 0, function* () {
        return (opts.region ||
            process.env.AWS_REGION ||
            (yield getServerlessYaml_1.getServerlessYaml()).provider.region);
    });
}
exports.getRegion = getRegion;
