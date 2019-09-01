import { IDictionary } from "common-types";
import { getConfig, isNpmPackage, isServerless } from "../../shared";
import { IDoDeployConfig } from "../../@types";

export type IDetectedTarget = {
  detected: IDoDeployConfig["target"] | "both";
  override: boolean;
  target: IDoDeployConfig["target"] | "both";
};

/**
 * Detects the target type and also looks to see if it has
 * been overriden by CLI params
 */
export async function detectTarget(
  opts?: IDictionary
): Promise<IDetectedTarget> {
  const { deploy: config } = await getConfig();
  const override = opts ? opts.target : undefined;
  const serverless = await isServerless();
  const npm = await isNpmPackage();
  const detected: IDoDeployConfig["target"] | "both" =
    serverless && !npm
      ? "serverless"
      : npm && !serverless
      ? "npm"
      : npm && serverless
      ? "both"
      : "unknown";

  return {
    detected,
    override: override && override !== detected ? override : false,
    target: override || detected
  };
}
