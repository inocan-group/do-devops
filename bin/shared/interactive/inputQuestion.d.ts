import { InputQuestion } from "inquirer";
import { Omit } from "common-types";
export declare function inputQuestion(q: Omit<InputQuestion, "type">): {
    type: string;
    default?: any;
    message?: import("inquirer").DynamicQuestionProperty<string | Promise<string>, import("inquirer").Answers>;
    name?: string | (string & {});
    validate?: (input: any, answers?: import("inquirer").Answers) => string | boolean | Promise<string | boolean>;
    transformer?: (input: any, answers: import("inquirer").Answers, flags: {
        isFinal?: boolean;
    }) => string | Promise<string>;
    filter?: (input: any) => any;
    prefix?: string;
    suffix?: string;
    when?: import("inquirer").DynamicQuestionProperty<boolean | Promise<boolean>, import("inquirer").Answers>;
};
