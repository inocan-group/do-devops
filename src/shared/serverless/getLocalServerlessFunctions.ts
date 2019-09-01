import { getServerlessYaml } from "./index";

export async function getLocalServerlessFunctions() {
  const fns = (await getServerlessYaml()).functions;
  return fns;
}
