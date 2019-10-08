import * as recast from "recast";
import { parseFile } from "./parseFile";
import get from "lodash.get";
import { IDictionary } from "common-types";
type VariableDeclaration = recast.types.namedTypes.VariableDeclaration;
type TSInterfaceDeclaration = recast.types.namedTypes.TSInterfaceDeclaration;
type CommentLine = recast.types.namedTypes.CommentLine;

export interface IExportedDeclaration {
  /**
   * The name of the export
   */
  name: string;
  /**
   * The JS _kind_ of variable of the export
   */
  kind: "const" | "let" | string;
  type:
    | "ObjectExpression"
    | "ArrowFunctionExpression"
    | "TSInterfaceDeclaration"
    | string;
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
export function namedExports(
  ast: recast.types.namedTypes.File
): IExportedDeclaration[] {
  const namedExports = ast.program.body.filter(
    i => i.type === "ExportNamedDeclaration"
  );

  const output: IExportedDeclaration[] = [];

  namedExports.forEach(i => {
    const type = get(i, "declaration.type");
    const declarations = get(i, "declaration.declarations.0");
    output.push({
      // name: get(i, "declaration.declarations.0.id.name", ""),
      type,
      kind:
        get(i, "declaration.kind") || type === "TSTypeAliasDeclaration"
          ? "type"
          : type === "TSInterfaceDeclaration"
          ? "interface"
          : "",
      interface: get(
        i,
        "declaration.declarations.0.id.typeAnnotation.typeAnnotation.typeName.name",
        null
      ),
      comments: get(i, "comments", []) as CommentLine[],
      ...(type === "VariableDeclaration"
        ? getVariableDeclaration(get(i, "declaration"))
        : type === "TSInterfaceDeclaration"
        ? getInterfaceDeclaration(get(i, "declaration"))
        : { name: "" })
    });
  });
  return output;
}

function getVariableDeclaration(declaration: VariableDeclaration) {
  const root = get(declaration, "declarations.0");
  const type = get(root, "init.type");
  const properties = get(root, "init.properties", []).map((i: IDictionary) => ({
    name: get(i, "key.name"),
    value:
      get(i, "value.value") ||
      get(i, "value.elements", []).map((i2: IDictionary) => {
        name: get(i2, "properties", []).map((i3: IDictionary) =>
          get(i3, "key.name")
        );
        value: get(i2, "properties", []).map((i3: IDictionary) =>
          get(i3, "value.value")
        );
      }),
    type: get(i, "value.type")
  }));
  const params = get(root, "init.params", []).map((i: any) =>
    get(i, "name", "")
  );

  return {
    name: get(root, "id.name"),
    interface: get(root, "id.typeAnnotation.typeAnnotation.typeName.name"),
    type,
    ...(properties ? { properties } : {}),
    ...(params.length > 0 ? { params } : {})
  };
}

function getInterfaceDeclaration(declaration: TSInterfaceDeclaration) {
  return {
    name: get(declaration, "id.name")
  };
}
