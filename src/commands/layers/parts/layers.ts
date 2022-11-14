import chalk from "chalk";
import { toTable } from "src/shared/ui";
import { getLayersFromPackageJson } from "src/shared/serverless";
import { DoDevopsHandler } from "src/@types/command";

const META_LINK_MSG = `{dim - the results rely on meta-data tagging; check out this link for more info:\n      {blueBright https://github.com/inocan-group/do-devops/docs/layer-meta.md}}\n`;

/** handler for the "layers" command */
export const handler: DoDevopsHandler = async ({ observations }) => {
  if (observations.has("serverlessFramework")) {
    const layers = getLayersFromPackageJson();
    if (layers.length > 0) {
      console.log(
        toTable(
          layers,
          { col: "name", format: { width: 30, alignment: "left" } },
          {
            col: "versions",
            formula: (v) => (Array.isArray(v) ? v.pop()?.version || "unknown" : v || "unknown"),
            format: { width: 7, alignment: "center" },
          },
          { col: "description", format: { width: 64, alignment: "left", wrapWord: true } }
        )
      );

      console.log(META_LINK_MSG);
    } else {
      console.log(`- there were {italic no} layers found as dependencies to this repo`);
      console.log(META_LINK_MSG);
    }
  } else {
    console.log(`- the current directory is not a Serverless repo\n`);
  }
};
