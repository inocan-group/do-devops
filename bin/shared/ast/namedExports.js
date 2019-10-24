"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const lodash_get_1 = __importDefault(require("lodash.get"));
/**
 * Returns an array of _named_ exports from the file which are variables.
 *
 * @param ast a Typescript file based AST
 */
function namedExports(ast) {
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
exports.namedExports = namedExports;
function getVariableDeclaration(declaration) {
    const root = lodash_get_1.default(declaration, "declarations.0");
    const type = lodash_get_1.default(root, "init.type");
    const properties = lodash_get_1.default(root, "init.properties", []).map((i) => ({
        name: lodash_get_1.default(i, "key.name"),
        value: getValue(lodash_get_1.default(i, "value")),
        // get(i, "value.value") ||
        // get(i, "value.elements", []).map((i2: IDictionary) => {
        //   name: get(i2, "properties", []).map((i3: IDictionary) =>
        //     get(i3, "key.name")
        //   );
        //   value: get(i2, "properties", []).map((i3: IDictionary) =>
        //     get(i3, "value.value")
        //   );
        // }),
        type: lodash_get_1.default(i, "value.type")
    }));
    const params = lodash_get_1.default(root, "init.params", []).map((i) => lodash_get_1.default(i, "name", ""));
    return Object.assign(Object.assign({ name: lodash_get_1.default(root, "id.name"), interface: lodash_get_1.default(root, "id.typeAnnotation.typeAnnotation.typeName.name"), type }, (properties ? { properties } : {})), (params.length > 0 ? { params } : {}));
}
/**
 * Given a property, gets the value based on the type
 */
function getValue(node) {
    switch (node.type) {
        case "Literal":
        case "StringLiteral":
        case "NumericLiteral":
        case "BooleanLiteral":
            return lodash_get_1.default(node, "value");
        case "TemplateLiteral":
            return lodash_get_1.default(node, "quasis.0.value.cooked");
        case "ObjectExpression":
            return lodash_get_1.default(node, "properties", []).reduce((agg, i) => {
                agg[lodash_get_1.default(i, "key.name")] = getValue(lodash_get_1.default(i, "value"));
                return agg;
            }, {});
        case "ArrayExpression":
            return lodash_get_1.default(node, "elements", []).map((i) => getValue(i));
        default:
            console.log("unknown type:", node.type);
    }
}
function getInterfaceDeclaration(declaration) {
    return {
        name: lodash_get_1.default(declaration, "id.name")
    };
}
