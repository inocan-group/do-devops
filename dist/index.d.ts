import { NamedTypes } from 'ast-types/gen/namedTypes';
import { AwsRegion, AwsStage, AwsArnPartition, IServerlessFunctionHandler, IDictionary, AwsAccountId } from 'common-types';
import * as recast from 'recast';
import * as aws_sdk_lib_request from 'aws-sdk/lib/request';
import * as aws_sdk from 'aws-sdk';
import { ApiGatewayV2, APIGateway, EC2, Lambda, IAM } from 'aws-sdk';

interface IExportDeclaration {
    defaultExport?: string;
    args: string[];
    symbols: string[];
}

/**
 * The format of properties found in the `~/.aws/credentials` file
 */
interface IAwsProfile {
    aws_access_key_id: string;
    aws_secret_access_key: string;
    region?: AwsRegion;
}
/**
 * Parameters used in the `aws-sdk` which credentialize
 * the API request.
 */
declare type IAwsCredentials = {
    /**
     * AWS access key ID.
     */
    accessKeyId: string;
    /**
     * AWS secret access key.
     */
    secretAccessKey: string;
    /**
     * AWS session token.
     */
    sessionToken?: string;
};
interface IAwsOptions {
    /** the AWS profile to use to credentialize the deployment */
    profile?: string;
    /** the AWS region that is being defaulted to */
    region?: AwsRegion;
    /** the AWS stage being targetted */
    stage?: AwsStage;
    /** The AWS partition being targetted */
    partition?: AwsArnPartition;
    /**
     * If observsation can't be made then fall back to using
     * interactive prompts to ask the user.
     */
    interactive?: boolean;
}

/**
 * The configuration which the AST process was able to
 * discover for a function along with the _interface_ being
 * used.
 */
declare type IDiscoveredConfig = {
    interface: string;
    config: IServerlessFunctionHandler;
};

interface IFilenameNotContent {
    /** the file's filename in the file system */
    filename: string;
    /** the contents of a file */
    content?: never;
}
interface IContentNotFilename {
    /** the file's filename in the file system */
    filename?: never;
    /** the contents of a file */
    content: string;
}
/**
 * Allows either a `filename` or the _contents_ of a file to be represented
 */
declare type IFileOrContent = IFilenameNotContent | IContentNotFilename;

/**
 * parses a given file into an AST tree using the recast **acorn** parser.
 */
declare function astParseWithAcorn(source: IFileOrContent): any;

/**
 * parses a given file into an AST tree
 * using the recast typescript parser.
 */
declare function astParseWithTypescript(filename: string): any;

declare type CommentLine$1 = NamedTypes["CommentLine"];
/**
 * Given a file, it will look for the `handler` export
 * and return the comments associated with it. Alternatively
 * it will also look for comments associated with the `fn`
 * export.
 */
declare function findHandlerComments(filename: string): unknown[];

/**
 * Given a handler file, this will return the object key/value
 * pairs of the file's `config` export.
 */
declare function findHandlerConfig(filename: string, 
/** the _package_ section should be replaced with a reference to the `filename.zip` */
isWebpackZip?: boolean): IDiscoveredConfig | undefined;

/**
 * Using AST, this function analyzes whether the file (or content) _has_
 * a default export and if it does, returns the tokens associated with it.
 */
declare function getDefaultExport(source: IFileOrContent): false | IExportDeclaration;

/**
 * Gets a list of all typescript files under the `src/handlers`
 * directory that have a `handlers` export.
 */
declare function getValidServerlessHandlers(opts?: IDictionary): string[];

/**
 * Gets a list of all typescript files under the `src/handlers`
 * directory that have a `handlers` export.
 */
declare function getValidStepFunctions(opts?: IDictionary): string[];

/**
 * Since the AST parser tends to provide tokens as dictionaries with a `type` property
 * it can be useful to have a type guard which tests for this. If you wish to extend the type-guard
 * to allow for other props
 */
declare function isTypeBasedObject<T extends {} = {}, K extends {
    type: string;
} = {
    type: string;
}>(thing: unknown): thing is T & K;

declare type CommentLine = recast.types.namedTypes.CommentLine;
interface IPropertyInfo {
    name: string;
    value: string;
    type: string;
}
interface ISpreadElement {
    type: "SpreadElement";
    argument: {
        type: "Identifier";
        name: string;
    };
}
interface IExportedDeclaration {
    /**
     * The name of the export
     */
    name: string;
    /**
     * The JS _kind_ of variable of the export
     */
    kind: "const" | "let" | string;
    type: "ObjectExpression" | "ArrowFunctionExpression" | "TSInterfaceDeclaration" | string;
    /**
     * if available, determine the TS interface used for this export
     */
    interface?: string;
    /**
     * if the export is an _object_ then list its properties
     */
    properties?: IPropertyInfo[];
    comments: CommentLine[];
}
/**
 * Returns an array of _named_ exports from the file which are variables.
 *
 * @param ast a Typescript file based AST
 */
declare function namedExports(file: string | recast.types.namedTypes.File): IExportedDeclaration[];

/**
 * Validates that the webpack config:
 *
 * 1. has a `modules.exports` declaration
 * 2. is a functional representation and the function takes a `fns` parameter
 * 3. warns to CLI if there is no `options` parameter
 *
 * @param filename optionally override the default webpack config filename
 */
declare function validateWebpackConfig(filename?: string): void;

/**
 * **addAwsProfile**
 *
 * adds a new profile to a user's `~/.aws/credentials` file
 */
declare function addAwsProfile(name: string, profile: IAwsProfile): void;

interface IAskForProfileOptions {
    /**
     * optionally state a particular profile name to be the default; if not stated
     * or not found then the first profile in the `credentials` file will be used.
     */
    defaultProfile?: string;
    /**
     * by default it will return an error to the caller but if you prefer it can
     * simply exit the process with an error message to the console.
     */
    exitOnError?: boolean;
}
/**
 * Asks the user to choose an AWS profile
 */
declare function askForAwsProfile(opts?: IAskForProfileOptions): Promise<string>;

/**
 * Asks the user to choose an AWS region
 */
declare function askForAwsRegion(): Promise<string>;

/**
 * Type guard which detects whether a give input is a `IAwsProfile` object
 * representing the data in a credentials file in a snake_case fashion.
 */
declare function isAwsProfile(input: unknown): input is IAwsProfile;
/**
 * Type guard which detects whether a give input is a `IAwsCred` object
 * representing the data in a credentials file in a snake_case fashion.
 */
declare function isAwsCredentials(input: unknown): input is IAwsCredentials;

/**
 * Tests whether the shell environment has the **AWS CLI**
 * available.
 */
declare function checkIfAwsInstalled(): Promise<boolean>;

/**
 * **convertProfileToApiCredential**
 *
 * Converts the `IAwsProfile` format (which mimics the snake_case naming you have in the credentials file) and
 * converts it to an `IAwsCredentials` shape which can be used directly in credentializing an
 * API call.
 *
 * **Errors:**
 *   - `do-devops/invalid-aws-profile`
 */
declare function convertProfileToApiCredential(profile: IAwsProfile): IAwsCredentials;

/**
 * Gets all API Gatway _endpoints_ defined in a given
 * AWS profile/account.
 */
declare function getApiGatewayEndpoints(profileName: string, region: string): Promise<{
    httpApi: aws_sdk_lib_request.PromiseResult<ApiGatewayV2.GetApisResponse, aws_sdk.AWSError>;
    restApi: aws_sdk_lib_request.PromiseResult<APIGateway.RestApis, aws_sdk.AWSError>;
}>;

/**
 * Using the AWS sdk to get the current AWS user's record
 * -- which the user should have _rights to_ -- we can parse
 * out the AWS Account ID.
 */
declare function getAwsAccountId(awsProfile: string): Promise<AwsAccountId>;

/**
 * Given a stated AWS profile that exists in a user's credentials file,
 * this function will use the AWS SDK to determine the default region
 * for the profile.
 */
declare function getAwsDefaultRegion(profileName: string): Promise<aws_sdk_lib_request.PromiseResult<EC2.DescribeAvailabilityZonesResult, aws_sdk.AWSError>>;

/**
 * Returns the `userId`, `accountId`, `arn`, and `user` when passed
 * the key/secret key found in a user's `~/.aws/credentials` file.
 *
 * @param profile a profile from a user's `credentials` file
 */
declare function getAwsIdentityFromProfile(profile: IAwsProfile): Promise<{
    userId: string | undefined;
    accountId: string | undefined;
    arn: string | undefined;
    user: string | undefined;
}>;

/**
 * Gets a list of AWS Lambda functions from a given AWS
 * profile and region. This list is provided using the
 * AWS CLI.
 */
declare function getAwsLambdaFunctions(opts: IAwsOptions): Promise<aws_sdk_lib_request.PromiseResult<Lambda.ListFunctionsResponse, aws_sdk.AWSError>>;

/**
 * Gets a list of AWS Lambda _layers_ from a given AWS
 * profile and region. This list is provided using the
 * AWS CLI.
 */
declare function getAwsLambdaLayers(opts: IAwsOptions): Promise<aws_sdk_lib_request.PromiseResult<Lambda.ListLayersResponse, aws_sdk.AWSError>>;

/**
 * Get a specific AWS _profile_ in the AWS _credentials_ file.
 *
 * Possible errors:
 *   - `do-devops/invalid-profile-name`
 *   - `do-devops/no-credentials-file`
 */
declare function getAwsProfile(profileName: string): Promise<IAwsProfile>;

/**
 * **getAwsProfileDictionary**
 *
 * Interogates the `~/.aws/credentials` file to get a hash of
 * profiles (name/dictionary of values) the user has available.
 *
 * If the file isn't found then an empty object is returned.
 */
declare function getAwsProfileDictionary(): Promise<Record<string, IAwsProfile>>;

/**
 * **getAwsProfileList**
 *
 * Interogates the `~/.aws/credentials` file to get an array of
 * profiles which the user has defined.
 *
 * Note: _there is also a_ `getAwsProfileDictionary()` _function if
 * prefer a dictionary._
 */
declare function getAwsProfileList(): Promise<Array<IAwsProfile & {
    name: string;
}>>;

/**
 * Uses the AWS SDK to get the user's profile information.
 *
 * @param awsProfile you may pass in the _string_ name of the profile or the profile itself
 */
declare function getAwsUserProfile(awsProfile: IAwsProfile | string): Promise<IAM.GetUserResponse["User"]>;

/**
 * Returns the path to the file if found, if not found then returns
 * `false`.
 */
declare function hasAwsProfileCredentialsFile(): string | false;

/**
 * Indicates whether the given user has the _credentials_ for a given
 * AWS profile.
 */
declare function userHasAwsProfile(profileName: string): Promise<boolean>;

export { CommentLine$1 as CommentLine, IAskForProfileOptions, IExportedDeclaration, IPropertyInfo, ISpreadElement, addAwsProfile, askForAwsProfile, askForAwsRegion, astParseWithAcorn, astParseWithTypescript, checkIfAwsInstalled, convertProfileToApiCredential, findHandlerComments, findHandlerConfig, getApiGatewayEndpoints, getAwsAccountId, getAwsDefaultRegion, getAwsIdentityFromProfile, getAwsLambdaFunctions, getAwsLambdaLayers, getAwsProfile, getAwsProfileDictionary, getAwsProfileList, getAwsUserProfile, getDefaultExport, getValidServerlessHandlers, getValidStepFunctions, hasAwsProfileCredentialsFile, isAwsCredentials, isAwsProfile, isTypeBasedObject, namedExports, userHasAwsProfile, validateWebpackConfig };
