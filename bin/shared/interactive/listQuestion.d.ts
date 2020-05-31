import { ListQuestion } from "inquirer";
import { Omit } from "common-types";
export declare function listQuestion(q: Omit<ListQuestion, "type">): {
    type: string;
    choices?: import("inquirer").DynamicQuestionProperty<readonly import("inquirer").DistinctChoice<import("inquirer").ListChoiceMap<import("inquirer").Answers>>[] | Promise<readonly import("inquirer").DistinctChoice<import("inquirer").ListChoiceMap<import("inquirer").Answers>>[]>, import("inquirer").Answers>;
    pageSize?: number;
    name?: string | (string & {});
    message?: import("inquirer").DynamicQuestionProperty<string | Promise<string>, import("inquirer").Answers>;
    default?: any;
    prefix?: string;
    suffix?: string;
    filter?: (input: any) => any;
    when?: import("inquirer").DynamicQuestionProperty<boolean | Promise<boolean>, import("inquirer").Answers>;
    validate?: (input: any, answers?: import("inquirer").Answers) => string | boolean | Promise<string | boolean>;
};
