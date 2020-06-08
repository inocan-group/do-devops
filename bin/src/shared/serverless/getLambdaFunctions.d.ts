import { Lambda } from "aws-sdk";
import { IDictionary } from "common-types";
/**
 * Uses the AWS Lambda API to retrieve a list of functions for given
 * profile/region.
 */
export declare function getLambdaFunctions(opts?: IDictionary): Promise<Lambda.FunctionList>;
