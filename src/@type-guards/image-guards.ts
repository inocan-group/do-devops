import { ExifDate, ExifDateTime } from "exiftool-vendored";
import { IImageCacheRef } from "src/@types";

/**
 * A type guard which helps to distinguish between the ExifTool's
 * categorical/reduced set versus other levels of detail.
 */
export function hasCatoricalMetadata(
  input: IImageCacheRef
): input is IImageCacheRef<"categorical"> {
  return input.metaDetailLevel === "categorical";
}

/**
 * A type guard which helps to distinguish between ExifTool's
 * **full** set of metadata versus other levels of detail.
 */
export function hasTagsMetadata(input: IImageCacheRef): input is IImageCacheRef<"tags"> {
  return input.metaDetailLevel === "tags";
}

export function isExifDateTime(d: unknown): d is ExifDateTime {
  return (
    typeof d === "object" &&
    Object.keys(d as object).includes("year") &&
    Object.keys(d as object).includes("second") &&
    Object.keys(d as object).includes("zone")
  );
}

export function isExifDate(d: unknown): d is ExifDate {
  return (
    typeof d === "object" &&
    Object.keys(d as object).includes("year") &&
    !Object.keys(d as object).includes("second") &&
    Object.keys(d as object).includes("zone")
  );
}
