import chalk from "chalk";
import { table, TableUserConfig } from "table";
import { toTable } from "~/shared/ui";
import { getLayersFromPackageJson } from "~/shared/serverless";
import { DoDevopsHandler } from "~/@types/command";

const META_LINK_MSG = chalk`{dim - the results rely on meta-data tagging; check out this link for more info:\n      {blueBright https://github.com/inocan-group/do-devops/docs/layer-meta.md}}\n`;

/** handler for the "layers" command */
export const handler: DoDevopsHandler = async ({ observations }) => {
  if (observations.includes("serverlessFramework")) {
    const layers = getLayersFromPackageJson();
    if (layers.length > 0) {
      const data = toTable(
        layers,
        "name",
        [
          "versions",
          (v) => (Array.isArray(v) ? v.pop()?.version || "unknown" : v || "unknown"),
        ],
        "description"
      );

      const config: TableUserConfig = {
        columns: {
          // name
          0: { width: 30, alignment: "left" },
          // version
          1: { width: 7, alignment: "center" },
          // description
          2: { width: 64, alignment: "left", wrapWord: true },
        },
      };

      console.log(table([["Name", "Version", "Description"], ...data], config));
      console.log(META_LINK_MSG);
    } else {
      console.log(
        chalk`- there were {italic no} layers found as dependencies to this repo`
      );
      console.log(META_LINK_MSG);
    }
  } else {
    console.log(chalk`- the current directory is not a Serverless repo\n`);
  }
};
