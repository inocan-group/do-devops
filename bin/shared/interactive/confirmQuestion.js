"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.confirmQuestion = void 0;
function confirmQuestion(q) {
    return Object.assign(Object.assign({}, q), { type: "confirm" });
}
exports.confirmQuestion = confirmQuestion;
