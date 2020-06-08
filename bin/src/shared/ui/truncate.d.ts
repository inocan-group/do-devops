/**
 * Converts an array of _strings/numbers_ into a string representation where
 * there is a _maximum length_ if where exceeded the array is truncated and
 * and elipsis is added instead.
 *
 * @param things a list of strings or numbers
 * @param maxLength the maximum number of items to display
 * @param separater the separater symbol
 */
export declare function truncate(things: Array<string | number>, maxLength: number, separater?: string): string;
