"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const parseFile_1 = require("./parseFile");
const lodash_get_1 = __importDefault(require("lodash.get"));
/**
 * Returns an array of _named_ exports from the file which are variables.
 *
 * @param ast a Typescript file based AST
 */
function namedVariableDeclarations(ast) {
    const namedExports = ast.program.body.filter(i => i.type === "ExportNamedDeclaration");
    const output = [];
    namedExports.forEach(i => {
        const type = lodash_get_1.default(i, "declaration.type");
        const declarations = lodash_get_1.default(i, "declaration.declarations.0");
        output.push(Object.assign({ 
            // name: get(i, "declaration.declarations.0.id.name", ""),
            type, kind: lodash_get_1.default(i, "declaration.kind") || type === "TSTypeAliasDeclaration"
                ? "type"
                : type === "TSInterfaceDeclaration"
                    ? "interface"
                    : "", interface: lodash_get_1.default(i, "declaration.declarations.0.id.typeAnnotation.typeAnnotation.typeName.name", null), comments: lodash_get_1.default(i, "comments", []) }, (type === "VariableDeclaration"
            ? getVariableDeclaration(lodash_get_1.default(i, "declaration"))
            : type === "TSInterfaceDeclaration"
                ? getInterfaceDeclaration(lodash_get_1.default(i, "declaration"))
                : { name: "" })));
    });
    return output;
}
exports.namedVariableDeclarations = namedVariableDeclarations;
function getVariableDeclaration(declaration) {
    const root = lodash_get_1.default(declaration, "declarations.0");
    const type = lodash_get_1.default(root, "init.type");
    const properties = lodash_get_1.default(root, "init.properties", []).map((i) => ({
        name: lodash_get_1.default(i, "key.name"),
        value: lodash_get_1.default(i, "value.value") ||
            lodash_get_1.default(i, "value.elements", []).map((i2) => {
                name: lodash_get_1.default(i2, "properties", []).map((i3) => lodash_get_1.default(i3, "key.name"));
                value: lodash_get_1.default(i2, "properties", []).map((i3) => lodash_get_1.default(i3, "value.value"));
            }),
        type: lodash_get_1.default(i, "value.type")
    }));
    const params = lodash_get_1.default(root, "init.params", []).map((i) => lodash_get_1.default(i, "name", ""));
    return Object.assign({ name: lodash_get_1.default(root, "id.name"), interface: lodash_get_1.default(root, "id.typeAnnotation.typeAnnotation.typeName.name"), type }, (properties ? { properties } : {}), (params.length > 0 ? { params } : {}));
}
function getInterfaceDeclaration(declaration) {
    return {
        name: lodash_get_1.default(declaration, "id.name")
    };
}
const c = namedVariableDeclarations(parseFile_1.parseFile("/Volumes/Coding/universal/transport-services/src/handlers/messenger.ts"));
console.log(c);
