export interface IServerlessFnDictionary {
  /** full path to the handler files */
  filePath: string;
  /** the full path to the directory which has the handler and function files */
  fileDir: string;
  /** relative path to the handler and function files */
  relativePath: string;
  /** whether or not file is a valid serverless handler definition */
  validHandlerDefinition: boolean;
  /** the filename of the handler configuration */
  configFilename: string;
  /** the filename of the actual serverless function */
  fnFilename: string;
  /** serverless registered name */
  serverlessFn: string;
}
