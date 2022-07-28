import { ExifDate, ExifDateTime, Tags } from "exiftool-vendored";
import { isExifDate } from "src/@type-guards";
import { IExifToolMetadata } from "src/@types";

/**
 * converts ExifDate to ExifDateTime, if not an ExifDate then just passes
 * through as is.
 */
export function convertExifDateToExifDataString<T extends unknown>(
  d: T | ExifDate
): Exclude<ExifDateTime | T, ExifDate> {
  return (isExifDate(d) ? ExifDateTime.fromISO(d.toISOString()) : d) as Exclude<
    ExifDateTime | T,
    ExifDate
  >;
}

/**
 * Accepts ISO string dates, ExifDateTime, or ExifDate and in all of these cases
 * it converts to ExifDateTime. If undefined is passed in then undefined will be
 * passed through.
 */
export function convertToExifDateTime(
  d: string | ExifDateTime | ExifDate | undefined
): ExifDateTime | undefined {
  if (!d) {
    return undefined;
  } else if (isExifDate(d)) {
    d = convertExifDateToExifDataString(d);
  } else if (typeof d === "string") {
    d = ExifDateTime.fromISO(d);
  }

  return d;
}

/** extracts just the focal length for a 35mm in formats which have both */
export function reduceFl35(input: string | undefined) {
  if (!input) {
    return input;
  }

  const re = /:(.*)\)/;
  const matched = input.match(re);
  return matched ? matched[1] : input;
}

/**
 * Polishes data returned from ExifTool's `Tags` output
 */
export function improveMetaResults<T extends {} = {}>(meta: Tags) {
  return { ...meta } as IExifToolMetadata<T>;
}
