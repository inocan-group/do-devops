"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = __importDefault(require("chalk"));
const async_shelljs_1 = require("async-shelljs");
const table_1 = require("table");
const date_fns_1 = require("date-fns");
function execute(options) {
    return __awaiter(this, void 0, void 0, function* () {
        const profile = options.ssm.profile;
        const region = options.ssm.region;
        const filterBy = options._unknown ? options._unknown.shift() : undefined;
        console.log(`- Listing SSM parameters in profile "${chalk_1.default.bold(profile)}", region "${chalk_1.default.bold(region)}"${filterBy
            ? `; results reduced to those with "${chalk_1.default.bold(filterBy)}" in the name.`
            : ""}`);
        console.log();
        const list = JSON.parse(yield async_shelljs_1.asyncExec(`aws --profile ${profile} --region ${region} ssm describe-parameters`, { silent: true }));
        let tableData = [
            [
                chalk_1.default.bold("Name"),
                chalk_1.default.bold("Version"),
                chalk_1.default.bold("Type"),
                chalk_1.default.bold("LastModified"),
                chalk_1.default.bold("User")
            ]
        ];
        list.Parameters.filter(i => filterBy ? i.Name.toLowerCase().includes(filterBy.toLowerCase()) : true).forEach(i => {
            tableData.push([
                i.Name,
                String(i.Version),
                i.Type,
                date_fns_1.format(i.LastModifiedDate * 1000, "DD MMM, YYYY"),
                i.LastModifiedUser.replace(/.*user\//, "")
            ]);
        });
        const tableConfig = {
            columns: {
                0: { width: 42, alignment: "left" },
                1: { width: 8, alignment: "center" },
                2: { width: 14, alignment: "center" },
                3: { width: 18, alignment: "center" },
                4: { width: 14 }
            }
        };
        console.log(table_1.table(tableData, tableConfig));
    });
}
exports.execute = execute;
