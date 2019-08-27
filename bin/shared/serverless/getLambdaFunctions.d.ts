import { Lambda } from "aws-sdk";
import { IDictionary } from "common-types";
export declare function getLambdaFunctions(opts?: IDictionary): Promise<Lambda.FunctionConfiguration[]>;
