import { IDictionary } from "common-types";
import { IDoDeployConfig } from "~/@types";
import { isNpmPackage } from "~/shared/npm";
import { isServerless } from "~/shared/observations";

export type IDetectedTarget = {
  detected: IDoDeployConfig["target"] | "both";
  override: boolean;
  target: IDoDeployConfig["target"] | "both";
};

/**
 * Detects the target type and also looks to see if it has
 * been overriden by CLI params
 */
export async function detectTarget(opts?: IDictionary): Promise<IDetectedTarget> {
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
    target: override || detected,
  };
}
