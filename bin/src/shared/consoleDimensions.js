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
exports.consoleDimensions = void 0;
const async_shelljs_1 = require("async-shelljs");
/**
 * gets back the `height` and `width` of the current
 * console
 */
function consoleDimensions() {
    return __awaiter(this, void 0, void 0, function* () {
        let [width, height] = (yield async_shelljs_1.asyncExec(`echo $(tput cols),$(tput lines)`, {
            silent: true
        }))
            .split(",")
            .map(i => Number(i));
        width = process.stdout.columns || width;
        height = process.stdout.rows || height;
        return { height, width };
    });
}
exports.consoleDimensions = consoleDimensions;
