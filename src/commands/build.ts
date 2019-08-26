import { buildServerlessMicroserviceProject, emoji } from "../shared";
import chalk from "chalk";

export function description() {
  return `Efficient and clear build pipelines for serverless and/or NPM libraries`;
}

export async function handler() {
  console.log(
    chalk`- building the {bold {green serverless.yml}} file ${emoji.party}`
  );

  await buildServerlessMicroserviceProject();
}
