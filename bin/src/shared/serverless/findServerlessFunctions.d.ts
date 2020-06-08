import { IDictionary } from "common-types";
export interface IServerlessFunctionDefinitions {
    /**
     * A flag to indicate whether Serverless definitions
     * exist. This is typically used to switch between
     * the use of `serverless.yml` as the "system of record"
     * or instead if the `typescript-microservice` config
     * options should be treated as the SOR.
     */
    usingTypescriptMicroservices: boolean;
    /**
     * Detects if there are any conflicts between configuration
     * types. If this repo
     */
    hasConflicts: boolean;
    inServerlessConfigDir: string[];
    /**
     * later versions of `typescript-microservice` encourage you
     * to define your functions alongside your handler functions
     * as "sidecar files" with the filename `[fn]-defn.ts`. This
     * property captures a list of paths to these sidecar files.
     */
    sidecarDefinitions: string[];
}
/**
 * will look for serverless function definitions in three places:
 *
 * 1. throughout the `src` directory as the glob pattern `**\/*[-]defn`
 * 2. in the `serverless-config/functions/index.ts` file
 * 3. in the `serverless.yml` file
 *
 * The first two options only apply to projects using the `typescript-microservice`
 * yeoman template but obviously the third would apply to anyone. The results will
 * be returned in the `IServerlessFunctionDefinitions` interface structure.
 */
export declare function findServerlessFunctionDefinitions(options: IDictionary): void;
