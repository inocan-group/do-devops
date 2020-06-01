"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findServerlessFunctionDefinitions = void 0;
/**
 * will look for serverless function definitions in three places:
 *
 * 1. throughout the `src` directory as the glob pattern `**\/*[-]defn`
 * 2. in the `serverless-config/functions/index.ts` file
 * 3. in the `serverless.yml` file
 *
 * The first two options only apply to projects using the `typescript-microservice`
 * yeoman template but obviously the third would apply to anyone. The results will
 * be returned in the `IServerlessFunctionDefinitions` interface structure.
 */
function findServerlessFunctionDefinitions(options) { }
exports.findServerlessFunctionDefinitions = findServerlessFunctionDefinitions;
