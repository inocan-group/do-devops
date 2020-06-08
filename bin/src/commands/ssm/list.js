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
exports.execute = void 0;
const chalk = require("chalk");
const process = require("process");
const aws_ssm_1 = require("aws-ssm");
const date_fns_1 = require("date-fns");
const table_1 = require("table");
function execute(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const profile = options.profile;
        const region = options.region;
        const filterBy = options._unknown ? options._unknown.shift() : undefined;
        if (!profile || !region) {
            console.log(chalk `{red - missing information!}`);
            console.log(chalk `To list SSM params the AWS {italic profile} and {italic region} must be stated. These could {bold not} be determined so exiting.`);
            console.log(chalk `{dim note that the easiest way to get an explicit profile/region is to use the {bold --profile} and {bold --region} switches on the command line.}\n`);
            process.exit();
        }
        console.log(`- Listing SSM parameters in profile "${chalk.bold(options.profile)}", region "${chalk.bold(region)}"${filterBy ? `; results reduced to those with "${chalk.bold(filterBy)}" in the name.` : ""}`);
        console.log();
        const ssm = new aws_ssm_1.SSM({
            profile: options.profile,
            region,
        });
        const list = yield ssm.describeParameters();
        let tableData = [
            [chalk.bold("Name"), chalk.bold("Version"), chalk.bold("Type"), chalk.bold("LastModified"), chalk.bold("User")],
        ];
        list.forEach((i) => {
            tableData.push([
                i.Name,
                String(i.Version),
                i.Type,
                date_fns_1.format(i.LastModifiedDate, "dd MMM, yyyy"),
                i.LastModifiedUser.replace(/.*user\//, ""),
            ]);
        });
        const tableConfig = {
            columns: {
                0: { width: 42, alignment: "left" },
                1: { width: 8, alignment: "center" },
                2: { width: 14, alignment: "center" },
                3: { width: 18, alignment: "center" },
                4: { width: 14 },
            },
        };
        console.log(table_1.table(tableData, tableConfig));
    });
}
exports.execute = execute;