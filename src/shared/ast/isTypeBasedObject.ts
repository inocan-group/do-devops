import { IDictionary, isNonNullObject } from "common-types";

/**
 * Since the AST parser tends to provide tokens as dictionaries with a `type` property
 * it can be useful to have a type guard which tests for this. If you wish to extend the type-guard
 * to allow for other props
 */
export function isTypeBasedObject<T extends {} = {}, K extends { type: string } = { type: string }>(
  thing: unknown
): thing is T & K {
  return isNonNullObject(thing) && (thing as IDictionary).type;
}
