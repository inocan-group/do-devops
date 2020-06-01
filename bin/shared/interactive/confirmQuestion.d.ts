import { ConfirmQuestion } from "inquirer";
import { Omit } from "common-types";
export declare function confirmQuestion(q: Omit<ConfirmQuestion, "type">): {
    type: string;
    message?: import("inquirer").DynamicQuestionProperty<string | Promise<string>, import("inquirer").Answers>;
    name?: string | (string & {});
    validate?: (input: any, answers?: import("inquirer").Answers) => string | boolean | Promise<string | boolean>;
    filter?: (input: any) => any;
    default?: any;
    prefix?: string;
    suffix?: string;
    when?: import("inquirer").DynamicQuestionProperty<boolean | Promise<boolean>, import("inquirer").Answers>;
};
