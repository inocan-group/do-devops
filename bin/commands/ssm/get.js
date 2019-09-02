"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const aws_ssm_1 = require("aws-ssm");
const chalk_1 = __importDefault(require("chalk"));
const date_fns_1 = require("date-fns");
const table_1 = require("table");
const shared_1 = require("../../shared");
function execute(options) {
    var e_1, _a;
    return __awaiter(this, void 0, void 0, function* () {
        const profile = options.profile;
        const region = options.region;
        const secrets = options.params;
        const nonStandardPath = options.nonStandardPath;
        const { width } = yield shared_1.consoleDimensions();
        if (!region) {
            throw new shared_1.DevopsError(`Getting SSM secrets requires an ${chalk_1.default.bold("AWS Region")} and none could be deduced. You can explicitly state this by adding "--region XYZ" to the command.`);
        }
        if (!profile) {
            throw new shared_1.DevopsError(`Getting SSM secrets requires an ${chalk_1.default.bold("AWS Profile")} and none could be deduced. You can explicitly state this by adding "--profile XYZ" to the command.`);
        }
        console.log(`- Getting SSM details for: ${chalk_1.default.italic.grey.bold(secrets.join(", "))}\n`);
        const tableConfig = {
            columns: {
                0: { width: 30, alignment: "left" },
                1: { width: width > 125 ? 60 : width > 100 ? 40 : 35 },
                2: { width: 8, alignment: "center" },
                3: { width: 16, alignment: "center" }
            }
        };
        const ssm = new aws_ssm_1.SSM({ profile, region });
        try {
            for (var secrets_1 = __asyncValues(secrets), secrets_1_1; secrets_1_1 = yield secrets_1.next(), !secrets_1_1.done;) {
                const secret = secrets_1_1.value;
                let tableData = [
                    [
                        chalk_1.default.yellow.bold("Path"),
                        chalk_1.default.yellow.bold("ARN"),
                        chalk_1.default.yellow.bold("Version"),
                        chalk_1.default.yellow.bold("LastUpdated")
                    ]
                ];
                const data = yield ssm.get(secret, { decrypt: true, nonStandardPath });
                tableData.push([
                    data.path,
                    data.arn,
                    String(data.version),
                    date_fns_1.format(data.lastUpdated, "DD MMM, YYYY")
                ]);
                console.log(table_1.table(tableData, tableConfig));
                console.log(chalk_1.default.yellow.bold("VALUE:\n"));
                console.log(String(data.value));
                console.log();
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (secrets_1_1 && !secrets_1_1.done && (_a = secrets_1.return)) yield _a.call(secrets_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    });
}
exports.execute = execute;
