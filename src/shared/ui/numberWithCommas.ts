/**
 * Converts a number into a string representation which is comma delimited
 */
export function numberWithCommas(x: number) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
