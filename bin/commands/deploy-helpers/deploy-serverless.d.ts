import { IDoDeployServerless } from "../defaults";
import { IDictionary } from "common-types";
export interface IServerlessDeployMeta {
    stage: string;
    config: IDoDeployServerless;
    opts: IDictionary;
}
/**
 * Manages the execution of a serverless deployment
 */
export default function serverlessDeploy(argv: string[], opts: IDictionary): Promise<void>;
