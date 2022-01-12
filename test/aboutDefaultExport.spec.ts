import { aboutDefaultExport } from "~/errors/shared/ast/aboutDefaultExport";

describe("ast > aboutDefaultExport()", () => {

  it("string exported as default export", () => {
    const t = aboutDefaultExport("./test/autoindex-test/default/stringValue.ts");
    console.log(t);

  });


  it("function returning string", () => {
    const t = aboutDefaultExport("./test/autoindex-test/default/functionReturningString.ts");
    console.log(t);
  });

  it("anonymous function returning string", () => {
    const t = aboutDefaultExport("./test/autoindex-test/default/anonymousFunction.ts");
    console.log(t);
  });


});
