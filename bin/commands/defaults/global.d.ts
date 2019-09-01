export declare type IDoProjectType = 
/** a serverless project intended for a singular audience */
"serverless-project"
/** a serverless library meant to be consumed by multiple audiences */
 | "serverless-library"
/**
 * a library of typescript functions which are being exported to
 * be consumed by other JS/TS clients
 */
 | "library" | "vuejs-app";
export interface IDoGlobalConfig {
    projectType: IDoProjectType;
    /**
     * optionally state a **AWS** _profile_ name to use
     * if there is no additional information to work
     * off of
     */
    defaultAwsProfile?: string;
    /**
     * optionally state an **AWS** _region_ to use
     * if there is no additional information to work off
     * of
     */
    defaultAwsRegion?: string;
}
export declare function root(): IDoGlobalConfig;
