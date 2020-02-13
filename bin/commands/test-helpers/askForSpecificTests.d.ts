export declare enum SpecificTestReason {
    noResultsFound = 0,
    askedFor = 1
}
/** provide interactive help on choosing the right unit tests to run */
export declare function askForSpecificTests(reason: SpecificTestReason, tests: string[]): string[];
