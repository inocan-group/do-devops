"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timestamp = void 0;
const format_1 = require("date-fns/format");
function timestamp() {
    return `// indexed at: ${format_1.default(Date.now(), "Mo MMM, yyyy, hh:mm a ( O )")}\n`;
}
exports.timestamp = timestamp;
