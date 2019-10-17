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
const shared_1 = require("../../shared");
/**
 * Detects the target type and also looks to see if it has
 * been overriden by CLI params
 */
function detectTarget(opts) {
    return __awaiter(this, void 0, void 0, function* () {
        const { deploy: config } = yield shared_1.getConfig();
        const override = opts ? opts.target : undefined;
        const serverless = yield shared_1.isServerless();
        const npm = yield shared_1.isNpmPackage();
        const detected = serverless && !npm
            ? "serverless"
            : npm && !serverless
                ? "npm"
                : npm && serverless
                    ? "both"
                    : "unknown";
        return {
            detected,
            override: override && override !== detected ? override : false,
            target: override || detected
        };
    });
}
exports.detectTarget = detectTarget;
