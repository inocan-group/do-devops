export enum SpecificTestReason {
  noResultsFound,
  askedFor
}

/** provide interactive help on choosing the right unit tests to run */
export function askForSpecificTests(
  reason: SpecificTestReason,
  tests: string[]
): string[] {
  return [];
}
