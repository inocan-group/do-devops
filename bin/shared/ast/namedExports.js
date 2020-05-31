"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const file_1 = require("../file");
const get = require("lodash.get");
/**
 * Returns an array of _named_ exports from the file which are variables.
 *
 * @param ast a Typescript file based AST
 */
function namedExports(ast) {
    const namedExports = ast.program.body.filter((i) => i.type === "ExportNamedDeclaration");
    const output = [];
    namedExports.forEach((i) => {
        const type = get(i, "declaration.type");
        const declarations = get(i, "declaration.declarations.0");
        output.push(Object.assign({ 
            // name: get(i, "declaration.declarations.0.id.name", ""),
            type, kind: get(i, "declaration.kind") || type === "TSTypeAliasDeclaration"
                ? "type"
                : type === "TSInterfaceDeclaration"
                    ? "interface"
                    : "", interface: get(i, "declaration.declarations.0.id.typeAnnotation.typeAnnotation.typeName.name", null), comments: get(i, "comments", []) }, (type === "VariableDeclaration"
            ? getVariableDeclaration(get(i, "declaration"))
            : type === "TSInterfaceDeclaration"
                ? getInterfaceDeclaration(get(i, "declaration"))
                : { name: "" })));
    });
    return output;
}
exports.namedExports = namedExports;
function getVariableDeclaration(declaration) {
    const root = get(declaration, "declarations.0");
    const type = get(root, "init.type");
    const properties = get(root, "init.properties", []).map((i) => ({
        name: get(i, "key.name"),
        value: getValue(get(i, "value")),
        // get(i, "value.value") ||
        // get(i, "value.elements", []).map((i2: IDictionary) => {
        //   name: get(i2, "properties", []).map((i3: IDictionary) =>
        //     get(i3, "key.name")
        //   );
        //   value: get(i2, "properties", []).map((i3: IDictionary) =>
        //     get(i3, "value.value")
        //   );
        // }),
        type: get(i, "value.type"),
    }));
    const params = get(root, "init.params", []).map((i) => get(i, "name", ""));
    return Object.assign(Object.assign({ name: get(root, "id.name"), interface: get(root, "id.typeAnnotation.typeAnnotation.typeName.name"), type }, (properties ? { properties } : {})), (params.length > 0 ? { params } : {}));
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
            return get(node, "value");
        case "TemplateLiteral":
            return get(node, "quasis.0.value.cooked");
        case "ObjectExpression":
            return get(node, "properties", []).reduce((agg, i) => {
                agg[get(i, "key.name")] = getValue(get(i, "value"));
                return agg;
            }, {});
        case "ArrayExpression":
            return get(node, "elements", []).map((i) => getValue(i));
        case "SpreadElement":
            // TODO: this probably needs some more work
            return getSpread(node);
        default:
            console.log("unknown type:", node.type);
            file_1.write(`unhandled-node-${node.type}.json`, node, { offsetIfExists: true });
    }
}
function getInterfaceDeclaration(declaration) {
    return {
        name: get(declaration, "id.name"),
    };
}
function getSpread(node) {
    // TODO: rather than return the name; use the name to get the array
    // which is defined as an array
    return get(node, "argument.name");
}
