"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timestamp = void 0;
const date_fns_1 = require("date-fns");
function timestamp() {
    return `// indexed at: ${date_fns_1.format(Date.now(), "Mo MMM, yyyy, hh:mm a ( O )")}\n`;
}
exports.timestamp = timestamp;
