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
const chai_1 = require("chai");
const shared_1 = require("../src/shared");
const path_1 = require("path");
const expect = chai_1.default.expect;
const TEST_PATH = path_1.default.join(process.env.PWD, "/test/test-src");
describe("functions => ", () => {
    it("detects all files", () => __awaiter(void 0, void 0, void 0, function* () {
        const fns = findFunctionConfigurations(path_1.default.join(process.env.PWD, "/test/test-src"));
        expect(fns).to.have.lengthOf(3);
    }));
    it("parse of serverless function names works", () => __awaiter(void 0, void 0, void 0, function* () {
        const fns = findFunctionConfigurations(path_1.default.join(process.env.PWD, "/test/test-src"));
        const lookup = shared_1.getFunctionNames(fns);
        const expected = ["myBar", "rootPath"];
        expect(Object.keys(lookup)).to.have.lengthOf(3);
        fns.map(fn => {
            expect(lookup[fn]).to.be.a("string");
            expect(expected).to.include(lookup[fn]);
        });
    }));
    it("parse of shortened serverless function names works", () => __awaiter(void 0, void 0, void 0, function* () {
        const fns = findFunctionConfigurations(TEST_PATH).map(f => shared_1.reduceToRelativePath(TEST_PATH, f));
        const lookup = shared_1.getFunctionNames(fns);
        const expected = ["myBar", "rootPath"];
        expect(Object.keys(lookup)).to.have.lengthOf(3);
        fns.map(fn => {
            expect(lookup[fn]).to.be.a("string");
            expect(expected).to.include(lookup[fn]);
        });
    }));
    it.skip("duplicate function definitions are caught", () => __awaiter(void 0, void 0, void 0, function* () {
        const fns = findFunctionConfigurations(TEST_PATH);
        const lookup = shared_1.getFunctionNames(fns);
        const dups = shared_1.detectDuplicateFunctionDefinitions(lookup);
        expect(dups).to.have.lengthOf(1);
        expect(dups[0].fn);
    }));
    it("directories serve as pascalized namespace", () => __awaiter(void 0, void 0, void 0, function* () {
        const fns = findFunctionConfigurations(TEST_PATH);
        const lookup = shared_1.getNamespacedLookup(fns, TEST_PATH);
        const expected = ["fooMyBar", "fooBarMyBar", "fooBarMyBar2", "rootPath"];
        expect(fns).to.be.lengthOf(4);
        fns.forEach(fn => {
            expect(lookup[fn]).to.be.a("string");
            expect(expected).to.include(lookup[fn]);
        });
    }));
    it("all function definitions export default export", () => __awaiter(void 0, void 0, void 0, function* () {
        const { valid, invalid } = yield shared_1.validateExports(findFunctionConfigurations(TEST_PATH));
        expect(valid).has.lengthOf(2);
        expect(invalid).has.lengthOf(2);
    }));
    it("can create a valid function dictionary", () => __awaiter(void 0, void 0, void 0, function* () {
        const dict = yield shared_1.createFunctionDictionary(TEST_PATH);
        expect(dict).to.be.an("array");
        dict.forEach(f => {
            expect(f).to.be.an("object");
            expect(f).to.haveOwnProperty("filePath");
            expect(f).to.haveOwnProperty("relativePath");
            expect(f).to.haveOwnProperty("serverlessFn");
        });
    }));
    it.only("rejects files without default export", () => __awaiter(void 0, void 0, void 0, function* () {
        // const fns = findFunctionConfigurations(path.join(process.env.PWD, "/test/test-src"));
        shared_1.writeServerlessFunctionExports(TEST_PATH, path_1.default.join(TEST_PATH, "functions.ts"));
    }));
});
