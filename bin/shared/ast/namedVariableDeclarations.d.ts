import * as recast from "recast";
declare type CommentLine = recast.types.namedTypes.CommentLine;
export interface IExportedDeclaration {
    /**
     * The name of the export
     */
    name: string;
    /**
     * The JS _kind_ of variable of the export
     */
    kind: "const" | "let" | string;
    type: "ObjectExpression" | "ArrowFunctionExpression" | "TSInterfaceDeclaration" | string;
    /**
     * if available, determine the TS interface used for this export
     */
    interface?: string;
    /**
     * if the export is an _object_ then list its properties
     */
    properties?: IPropertyInfo[];
    comments: CommentLine[];
}
export interface IPropertyInfo {
    name: string;
    value: string;
    type: string;
}
/**
 * Returns an array of _named_ exports from the file which are variables.
 *
 * @param ast a Typescript file based AST
 */
export declare function namedVariableDeclarations(ast: recast.types.namedTypes.File): IExportedDeclaration[];
export {};
