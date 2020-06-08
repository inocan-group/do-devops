import { IDictionary } from "common-types";
/**
 * Looks for content that typically should not be in a index file so
 * it can be communicated to the user
 */
export declare function unexpectedContent(fileContent: string): false | IDictionary<boolean>;
