export type AstOperands = "(" | ")" | "{" | "}" | "," | ";";
export type AcornKeywords = "import" | "export" | "default" | "const";
export type AcornSymbols = string;

export interface IAcornLocLines {
  infos: {};
  mappings: {};
  cachedSourceMap: null | unknown;
  length: number;
  name: null | string;
}

export interface IAcornLct {
  line: number;
  column: number;
  token: number;
}

export interface IAcornLocToken {
  type: {
    label: AcornKeywords | "name" | "string" | AstOperands;
    keyword?: AcornKeywords;
    beforeExpr: boolean;
    startsExpr: boolean;
    isLoop: boolean;
    isAssign: boolean;
    prefix: boolean;
    postfix: boolean;
    binop: null | unknown;
    updateContext: null | unknown;
  };
  value: AcornKeywords | AstOperands | AcornSymbols;
  start: number;
  end: number;
  loc: {
    start: IAcornLct;
    end: IAcornLct;
  };
}

export interface IAcornLoc {
  start: IAcornLct;
  end: IAcornLct;
  lines: IAcornLocLines;
  tokens: IAcornLocToken[];
}

export interface IAcornDeclarationBase {
  type: "CallExpression" | string;
  start: number;
  end: number;
  loc: null | unknown;
}

export interface IAcornDeclarationCallExpresion extends IAcornDeclarationBase {
  type: "CallExpression";
  callee: {
    type: "Identifier";
    start: number;
    end: number;
    loc: IAcornLoc;
    name: string;
  };
  arguments: {};
}

export type IAcornDeclaration = IAcornDeclarationCallExpresion;

export interface IAcornBodyBase {
  type:
    | "ImportDeclaration"
    | "ExportDefaultDeclaration"
    | "ExportNamedDeclaration"
    | "ExpressionStatement"
    | "ExpressDeclaration"
    | "VariableDeclaration"
    | "FunctionDeclaration"
    | string;
  start: number;
  end: number;
  loc: IAcornLoc;
}
export interface IAcornBodyImport extends IAcornBodyBase {
  type: "ImportDeclaration";
  specifiers: unknown;
  source: unknown;
}
export interface IAcornBodyDefaultExport extends IAcornBodyBase {
  type: "ExportDefaultDeclaration";
  declaration: IAcornDeclaration;
}
export interface IAcornBodyNamedExport extends IAcornBodyBase {
  type: "ExportNamedDeclaration";
  declaration: IAcornDeclaration;
  specifiers: unknown;
  source: unknown;
}
export interface IAcornBodyVariable extends IAcornBodyBase {
  type: "VariableDeclaration";
  declarations: IAcornDeclaration[];
  kind: unknown;
  comments: unknown;
}
export interface IAcornBodyFunction extends IAcornBodyBase {
  type: "FunctionDeclaration";
  id: unknown;
  expression: unknown;
  generator: unknown;
  params: unknown;
  body: unknown;
}
export interface IAcornBodyExpression extends IAcornBodyBase {
  type: "ExpressionStatement";
  expression: unknown;
}

export type IAcornBodyElement =
  | IAcornBodyDefaultExport
  | IAcornBodyExpression
  | IAcornBodyFunction
  | IAcornBodyImport
  | IAcornBodyNamedExport
  | IAcornBodyVariable;

/**
 * The body of a **acorn** parsed file
 */
export type IAcornBody = IAcornBodyElement[];

export interface IAcornFileSummary {
  importCount: number;
  exportCount: number;
  hasDefaultExport: boolean;
  hasNamedExports: boolean;
  symbols: string[];
}

export interface IExportDeclaration {
  defaultExport?: string;
  args: string[];
  symbols: string[];
}
