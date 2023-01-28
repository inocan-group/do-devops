import {Expect, ExpectExtends, Equal} from "@type-challenges/utils";
import { ExpandRecursively } from "inferred-types";
import { GlobalOptions } from "src/@types";
import { Command } from "src/@types/command";
import { FromCommandDefn, OptionDefn } from "src/@types/option-types";
import { createCommand } from "src/shared/core/commands/createCommand";
import { describe, it } from "vitest";

describe("autoindex => ", () => {
  
  it("options converted to runtime values with FromCommandDefn", () => {
    const o = createCommand("foobar", async() => true, "this is a test", {
      options: {
        sfc: {
          type: Boolean,
          typeLabel: "type label",
          group: "local",
        },
        color: {
          type: String,
          defVal: "blue",
          group: "local",
        }
      }
    });
    type Cmd = typeof o;
    type Opt = Cmd["options"];
    type Converted = FromCommandDefn<Opt>;

    type Expected = ExpandRecursively<{ 
      sfc: boolean | undefined; 
      color: string; 
    } & GlobalOptions>;

    type cases = [
      // start with a Command
      Expect<ExpectExtends<Command<"foobar">, Cmd>>,
      // move into the option definition
      Expect<ExpectExtends<OptionDefn<any>, Opt>>,
      // using `FromCommandDefn` utility gets runtime values
      Expect<Equal<
        Converted,
        Expected
      >>
    ];
    const cases: cases = [ true, true, true ];
  });
  
  it.todo("indexing work with named exports");

  it.todo("indexing work with named-offset exports");
  it.todo("indexing work with default exports");

  it.todo("indexing detects new resource to index");
  it.todo("indexing ignores changes to change to file outside blocked content");

  it.todo("--dir from CLI is working");
  it.todo("--add from CLI is working");
  it.todo("--glob from is working");
});
