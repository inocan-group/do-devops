"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.description = void 0;
exports.description = () => `Automates the building of "index.ts" (and now "private.ts") files for exporting; if you include a comment starting with "// #autoindex into a file it will be auto-indexed. By default it will assume that you are using named exports but if you need default exports then you must state "// #autoindex:default" Finally, if you need to exclude certain files you can explicitly state them after the autoindex declaration with "exclude:a,b,c`;
