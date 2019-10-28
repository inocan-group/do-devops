import { getServerlessYaml } from "./index";

/**
 * Gets the list of functions defined in the `serverless.yml`
 * file.
 */
export async function getLocalServerlessFunctionsFromServerlessYaml() {
  const fns = (await getServerlessYaml()).functions;
  return fns;
}
