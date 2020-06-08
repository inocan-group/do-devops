import { IDictionary } from "common-types";
import { IDoDeployServerless } from "../../@types";
export interface IServerlessDeployMeta {
    stage: string;
    config: IDoDeployServerless;
    opts: IDictionary;
}
/**
 * Manages the execution of a serverless deployment
 */
export default function serverlessDeploy(argv: string[], opts: IDictionary): Promise<void>;
