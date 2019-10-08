import * as recast from "recast";
declare type ExportNamedDeclaration = recast.types.namedTypes.ExportNamedDeclaration;
declare type Declaration = ExportNamedDeclaration["declaration"];
/**
 * extracts the named declarations from an AST
 */
export declare function namedDeclarations(ast: recast.types.namedTypes.File): Declaration[];
export {};
