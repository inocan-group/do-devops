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
const shared_1 = require("../src/shared");
const chai_1 = require("chai");
describe("AWS Credentials => ", () => {
    it("getAwsProfileList() finds credentials file and produces structured information", () => __awaiter(void 0, void 0, void 0, function* () {
        const credentialsFile = shared_1.hasAwsProfileCredentialsFile();
        if (!credentialsFile) {
            console.log("this test will not run as there is not a credentials file");
        }
        else {
            const profiles = yield shared_1.getAwsProfileList();
            chai_1.expect(profiles).not.equal(false);
            if (profiles) {
                chai_1.expect(profiles).to.be.an("object");
                const firstKey = Object.keys(profiles).pop();
                chai_1.expect(profiles[firstKey]).to.be.an("object");
                chai_1.expect(Object.keys(profiles[firstKey])).to.include("aws_access_key_id");
                chai_1.expect(Object.keys(profiles[firstKey])).to.include("aws_secret_access_key");
            }
            else {
                console.log("This condition should not be met");
            }
        }
    }));
    it("getAwsProfile() gets a named AWS profile from credentials file", () => __awaiter(void 0, void 0, void 0, function* () {
        const credentialsFile = shared_1.hasAwsProfileCredentialsFile();
        if (!credentialsFile) {
            console.log("this test will not run as there is not a credentials file");
        }
        else {
            const profile = yield shared_1.getAwsProfileList();
            chai_1.expect(profile).to.be.an("object");
            chai_1.expect(Object.keys(profile)).to.include("aws_access_key_id");
            chai_1.expect(Object.keys(profile)).to.include("aws_secret_access_key");
        }
    }));
    it("getAwsProfile() fails with appropriate error if named profile does not exist", () => __awaiter(void 0, void 0, void 0, function* () {
        const credentialsFile = shared_1.hasAwsProfileCredentialsFile();
        if (!credentialsFile) {
            console.log("this test will not run as there is not a credentials file");
        }
        else {
            try {
                const profile = yield shared_1.getAwsProfile("does-not-exist");
                console.log(profile);
                throw new Error("should have thrown error before getting here!");
            }
            catch (e) {
                chai_1.expect(e.code).to.equal("not-ready");
            }
        }
    }));
});
