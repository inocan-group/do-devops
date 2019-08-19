import { getConfig } from "../shared";

export function description() {
  return `Efficient and clear build pipelines for serverless and/or NPM libraries`;
}

export async function handler() {
  const config = await getConfig();
}
