"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * extracts the named declarations from an AST
 */
function namedDeclarations(ast) {
    return ast.program.body
        .filter(i => i.type === "ExportNamedDeclaration")
        .map((i) => i.declaration);
}
exports.namedDeclarations = namedDeclarations;
