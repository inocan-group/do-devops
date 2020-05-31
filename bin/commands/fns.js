"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk = require("chalk");
const shared_1 = require("../shared");
const table_1 = require("table");
function description() {
    return `Lists all serverless function handlers and basic meta about them`;
}
exports.description = description;
exports.options = [
    {
        name: "forceBuild",
        alias: "f",
        type: Boolean,
        description: chalk `by default functions will be derived from {italic serverless.yml} but if you are in a {italic typescript-microservice} project you can force a rebuild prior to listing the functions`,
    },
];
function handler(args, opts) {
    return __awaiter(this, void 0, void 0, function* () {
        const filterBy = args.length > 0 ? (fn) => fn.includes(args[0]) : () => true;
        const status = yield shared_1.isServerless();
        if (!status) {
            console.log("- this project does not appear to be a Serverless project!\n");
            process.exit();
        }
        else if (status.isUsingTypescriptMicroserviceTemplate) {
            if (opts.forceBuild) {
                console.log(`- detected use of the ${chalk.blue("typescript-microservice")} template; rebuilding functions from config.`);
                yield shared_1.buildServerlessMicroserviceProject();
            }
            else {
                console.log(chalk `- detected use of the {blue typescript-microservice} template; use {bold {blue --forceBuild}} to rebuild prior to listing functions.\n`);
            }
        }
        try {
            const { width } = yield shared_1.consoleDimensions();
            const fns = (yield shared_1.getServerlessYaml()).functions;
            let tableData = [
                [
                    chalk.bold.yellow("function"),
                    chalk.bold.yellow("events"),
                    chalk.bold.yellow("memory"),
                    chalk.bold.yellow("timeout"),
                    chalk.bold.yellow("description"),
                ],
            ];
            Object.keys(fns)
                .filter(filterBy)
                .forEach((key) => {
                const events = fns[key].events || [];
                tableData.push([
                    key,
                    events.map((i) => Object.keys(i)).join(", "),
                    String(fns[key].memorySize || chalk.grey("1024")),
                    String(fns[key].timeout || chalk.grey("3")),
                    fns[key].description,
                ]);
            });
            const tableConfig = {
                columns: {
                    0: { width: 30, alignment: "left" },
                    1: { width: 16, alignment: "left" },
                    2: { width: 7, alignment: "center" },
                    3: { width: 10, alignment: "center" },
                    4: { width: 46, alignment: "left" },
                },
            };
            let output = table_1.table(tableData, tableConfig);
            if (width < 70) {
                delete tableConfig.columns["2"];
                delete tableConfig.columns["3"];
                delete tableConfig.columns["4"];
                output = table_1.table(tableData.map((i) => i.slice(0, 2), tableConfig));
            }
            else if (width < 80) {
                delete tableConfig.columns["3"];
                delete tableConfig.columns["4"];
                output = table_1.table(tableData.map((i) => i.slice(0, 3), tableConfig));
            }
            else if (width < 125) {
                delete tableConfig.columns["4"];
                output = table_1.table(tableData.map((i) => i.slice(0, 4), tableConfig));
            }
            console.log(output);
        }
        catch (e) {
            console.log(`- Error finding functions: ${e.message}\n`);
            process.exit();
        }
        // const inlineFns = await findInlineFunctionDefnFiles();
        // const configFiles = await findConfigFunctionDefnFiles();
        // console.log(inlineFns);
        // console.log(configFiles);
        // for await (const fn of inlineFns) {
        //   console.log(fn, fn.replace(process.env.PWD, ""));
        //   const e = await getExportsFromFile(fn);
        //   console.log(e);
        // }
    });
}
exports.handler = handler;
