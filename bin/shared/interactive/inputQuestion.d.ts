import { InputQuestion } from "inquirer";
import { Omit } from "common-types";
export declare function inputQuestion(q: Omit<InputQuestion, "type">): {
    type: string;
    transformer?: (input: any, answers: import("inquirer").Answers, flags: {
        isFinal?: boolean;
    }) => string | Promise<string>;
    name?: string | (string & {});
    message?: import("inquirer").DynamicQuestionProperty<string | Promise<string>, import("inquirer").Answers>;
    default?: any;
    prefix?: string;
    suffix?: string;
    filter?: (input: any) => any;
    when?: import("inquirer").DynamicQuestionProperty<boolean | Promise<boolean>, import("inquirer").Answers>;
    validate?: (input: any, answers?: import("inquirer").Answers) => string | boolean | Promise<string | boolean>;
};
