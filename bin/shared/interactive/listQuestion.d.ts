import { ListQuestion } from "inquirer";
import { Omit } from "common-types";
export declare function listQuestion(q: Omit<ListQuestion, "type">): {
    type: string;
    default?: any;
    message?: import("inquirer").DynamicQuestionProperty<string | Promise<string>, import("inquirer").Answers>;
    name?: string | (string & {});
    choices?: import("inquirer").DynamicQuestionProperty<readonly import("inquirer").DistinctChoice<import("inquirer").ListChoiceMap<import("inquirer").Answers>>[] | Promise<readonly import("inquirer").DistinctChoice<import("inquirer").ListChoiceMap<import("inquirer").Answers>>[]>, import("inquirer").Answers>;
    validate?: (input: any, answers?: import("inquirer").Answers) => string | boolean | Promise<string | boolean>;
    filter?: (input: any) => any;
    prefix?: string;
    suffix?: string;
    pageSize?: number;
    when?: import("inquirer").DynamicQuestionProperty<boolean | Promise<boolean>, import("inquirer").Answers>;
};
