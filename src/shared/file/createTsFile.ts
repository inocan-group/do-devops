/* eslint-disable unicorn/consistent-function-scoping */
export interface IEnumStruct {
  name: string;
  description: string;
  elements: Array<{ el: string; comment?: string }>;
}

export function createTsFile() {
  const enums: IEnumStruct[] = [];
  const enumTemplate = (c: IEnumStruct) => `
  /** 
   * ${c.description}
   */
  export enum ${c.name} {
    ${c.elements
      .map((e) => `${e.comment ? `/** ${e.comment} */\n  ` : ""}${e.el} = "${e.el}"`)
      .join(",\n  ")}
  }
  `;

  const types: { name: string; value: string }[] = [];
  const typeTemplate = (config: { name: string; value: string }) => `
  export type ${config.name} = ${config.value};
  `;

  const configurator = {
    addStringEnum(e: IEnumStruct) {
      enums.push(e);
      return configurator;
    },
    addType(name: string, value: string) {
      types.push({ name, value });
      return configurator;
    },

    generate() {
      let content = "";
      for (const e of enums) {
        content += enumTemplate(e);
      }
      for (const t of types) {
        content += typeTemplate(t);
      }

      return content;
    },
  };

  return configurator;
}
