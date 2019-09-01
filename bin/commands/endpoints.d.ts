import { IDictionary } from "common-types";
import { OptionDefinition } from "command-line-usage";
export declare const description = "Lists out all the endpoints defined in a given AWS profile/account.";
export declare const options: OptionDefinition[];
export declare function handler(args: string[], opts: IDictionary): Promise<void>;
