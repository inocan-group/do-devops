"use strict";
// #auto   index:named
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
// export * from "./testing.defn";
__export(require("./@types/index"));
__export(require("./commands/index"));
__export(require("./config/index"));
__export(require("./shared/index"));
//#endregion
