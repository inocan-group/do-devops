import { getServerlessYaml, serverlessYamlExists } from "./index";

/**
 * Gets the list of functions defined in the `serverless.yml`
 * file.
 */
export async function getLocalServerlessFunctionsFromServerlessYaml() {
  return serverlessYamlExists() ? (await getServerlessYaml()).functions : {};
}
