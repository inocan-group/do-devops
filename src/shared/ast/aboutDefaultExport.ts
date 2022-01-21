import { Project, SymbolFlags, SyntaxKind } from "ts-morph";

function symbolLookup(sym: SymbolFlags) {
  switch (sym) {
    case SymbolFlags.Property:
      return "property";
    case SymbolFlags.Alias:
      return "alias";
    case SymbolFlags.AliasExcludes:
      return "alias excludes";
    case SymbolFlags.Function:
      return "function";
    case SymbolFlags.Class:
      return "class";
    case SymbolFlags.Constructor:
      return "constructor";
    case SymbolFlags.Enum:
      return "enum";
    case SymbolFlags.ConstEnum:
      return "const enum";

    default:
      return sym;
  }
}

export function aboutDefaultExport(file: string) {
  const p = new Project();
  p.addSourceFileAtPath(file);
  const source = p.getSourceFileOrThrow(file);
  const assignments = source.getExportAssignments();
  const defExp = source.getDefaultExportSymbol();
  const symbols = source.getExportSymbols().map(i => ({
    name: i.getName(),
    declaredType: i.getDeclaredType().getText(),
    escapedName: i.getEscapedName(),
    isArray: i.getDeclaredType().isArray(),
    isBoolean: i.getDeclaredType().isBoolean(),
    isString: i.getDeclaredType().isString(),
    isStringLiteral: i.getDeclaredType().isStringLiteral(),
    isNumber: i.getDeclaredType().isNumber(),
    flag: symbolLookup(i.getFlags()),
    members: i.getMembers().map(m => m.getName())
  }));

  const variables = source.getStatements().filter(i => i.getKind() === SyntaxKind.VariableStatement).map(v => ({
    text: v.getText(),
    isArray: v.getType().isArray(),
    isBoolean: v.getType().isBoolean(),
    isString: v.getType().isString(),
    isStringLiteral: v.getType().isStringLiteral(),
    isNumber: v.getType().isNumber(),
    isObject: v.getType().isObject(),
    flags: v.getCombinedModifierFlags(),
    kind: v.getKindName(),
  }));
  const fn = source.getFunctions().find((f) => f.hasDefaultKeyword());
  const types = source.getTypeAliases().filter((f) => f.isExported());

  // const count =
  //   assignments.length + variables.length + functions.length + exp.length + types.length;

  const isFunction = fn ? true : false;



  return symbols.map(i => i.name).includes("default") ? {
    isFunction,
    symbols: symbols,
    defaultExport: defExp ? {
      exp: defExp.getExportSymbol().getName(),
      symbol: defExp.getDeclarations().map(d => ({ text: d.getText(), type: d.getType().getText() })),
      symbolType: symbolLookup(defExp.getExportSymbol().getFlags()),
      type: { ts: defExp.getDeclaredType(), name: defExp.getDeclaredType().getApparentType().getText(), flags: symbolLookup(defExp.getFlags()) },
      body: defExp.getDeclarations().map(d => d.getText()),
      // kind: defExp.getMembers(),
      flags: symbolLookup(defExp.getFlags()),
      c: defExp.getValueDeclaration()?.getType().getText(),
      isAlias: defExp.isAlias(),
    } : undefined,
    assignments: assignments.map(ass => ({
      // variables: ass.getSymbolsInScope(SymbolFlags.Variable).map(v => v.getName()),
      text: ass.getText(),
      expression: ass.getExpression().getText(),
      type: ass.getType().getText()
    })),
    variables,
    fn: fn ? {
      name: fn?.getName(),
      params: fn?.getParameters().map(p => p.getName()),
      returns: {
        text: fn?.getReturnType().getText(),
        // type: fn?.getReturnType() 
      },

    } : false,
    body: fn?.getBodyText(),
    types
  } : undefined;
}
