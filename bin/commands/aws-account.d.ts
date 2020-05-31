import { IDictionary } from "common-types";
export declare function description(): string;
export declare const signature = "<aws-profile-name>";
export declare const examples: {
    name: string;
    desc: string;
    example: string;
}[];
export declare function handler(argv: string[], opts: IDictionary): Promise<void>;
