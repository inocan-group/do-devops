import { IDictionary } from "common-types";
import { getAwsProfileFromServerless } from "./index";
import { getServerlessYaml } from "./getServerlessYaml";

/**
 * Determines the appropriate `region` to point at for the **sls** command.
 * This is based on config, CLI options, and the Serverless configuration.
 *
 * @param opts the CLI options which were used
 */
export async function getRegion(opts: IDictionary) {
  return (
    opts.region ||
    process.env.AWS_REGION ||
    (await getServerlessYaml()).provider.region
  );
}
