import { aboutDefaultExport } from "src/shared/ast/aboutDefaultExport";
import { describe, it } from "vitest";

describe.only("ast > aboutDefaultExport()", () => {
  it("string exported as default export", () => {
    const t = aboutDefaultExport("./test/autoindex-test/default/stringValue.ts");
    // console.log("EXPORT", t?.defExport);
    // console.log("ASSIGNMENTS", t?.assignments);
    // console.log("FUNCTION", t?.fn);
    // console.log("TYPES", t?.types);
    console.log("VARIABLES", t?.variables);
  });

  it("string exported as default export and with explicit type", () => {
    const t = aboutDefaultExport("./test/autoindex-test/default/stringValueWithExplicitType.ts");
    // console.log("EXPORT", t?.defExport);
    // console.log("ASSIGNMENTS", t?.assignments);
    // console.log("SYM", t?.symbols);
    // console.log("FUNCTION", t?.fn);
    // console.log("TYPES", t?.types);
    console.log("VARIABLES", t?.variables);
  });

  it("function returning string", () => {
    const t = aboutDefaultExport("./test/autoindex-test/default/functionReturningString.ts");
    // console.log("EXPORT", t?.defExport);
    // console.log("ASSIGNMENTS", t?.assignments);
    // console.log("SYM", t?.symbols);
    // console.log("FUNCTION", t?.fn);
    // console.log("TYPES", t?.types);
    console.log("VARIABLES", t?.variables);
  });

  it("anonymous function returning string", () => {
    const t = aboutDefaultExport("./test/autoindex-test/default/anonymousFunction.ts");
    console.log("EXPORT", t?.defExport);
    console.log("ASSIGNMENTS", t?.assignments);
    console.log("SYM", t?.symbols);
    console.log("FUNCTION", t?.fn);
    console.log("TYPES", t?.types);
    console.log("VARIABLES", t?.variables);
  });
  it("returning both default and named export", () => {
    const t = aboutDefaultExport("./test/autoindex-test/hybrid/defaultAndNamed.ts");
    console.log("EXPORT", t?.defExport);
    console.log("ASSIGNMENTS", t?.assignments);
    console.log("SYM", t?.symbols);
    console.log("FUNCTION", t?.fn);
    console.log("TYPES", t?.types);
    console.log("VARIABLES", t?.variables);
  });

  it("synchronous vue component", () => {
    const t = aboutDefaultExport("./test/autoindex-test/vue/SyncComp.ts");
    console.log("EXPORT", t?.defExport);
    console.log("ASSIGNMENTS", t?.assignments);
    console.log("SYM", t?.symbols);
    console.log("FUNCTION", t?.fn);
    console.log("TYPES", t?.types);
    console.log("VARIABLES", t?.variables);
  });

  it("asynchronous vue component", () => {
    const t = aboutDefaultExport("./test/autoindex-test/vue/AsyncComp.ts");
    console.log("EXPORT", t?.defExport);
    console.log("ASSIGNMENTS", t?.assignments);
    console.log("FUNCTION", t?.fn);
    console.log("TYPES", t?.types);
    console.log("VARIABLES", t?.variables);
  });

  it("asynchronous vue component stored as variable", () => {
    const t = aboutDefaultExport("./test/autoindex-test/vue/AsyncCompAsVariable.ts");
    console.log(t);
  });
});
