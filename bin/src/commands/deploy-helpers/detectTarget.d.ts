import { IDictionary } from "common-types";
import { IDoDeployConfig } from "../../@types";
export declare type IDetectedTarget = {
    detected: IDoDeployConfig["target"] | "both";
    override: boolean;
    target: IDoDeployConfig["target"] | "both";
};
/**
 * Detects the target type and also looks to see if it has
 * been overriden by CLI params
 */
export declare function detectTarget(opts?: IDictionary): Promise<IDetectedTarget>;
