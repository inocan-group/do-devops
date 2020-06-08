import { IServerlessConfig } from "common-types";
export interface IHandlerReference {
    file: string;
    ref: {
        handler: () => void;
        config?: Omit<IServerlessConfig, "handler">;
    };
}
