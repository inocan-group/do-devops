import { ExifDate, ExifDateTime } from "exiftool-vendored";
import { IAllImageMeta, ICategoricalMetaWithSharp, IExifToolMeta, ImageMetadata } from "~/@types";

/**
 * A type guard which helps to distinguish between the ExifTool's
 * categorical/reduced set versus other levels of detail.
 */
export function hasCatoricalMetadata(meta: ImageMetadata): meta is ICategoricalMetaWithSharp {
  return meta.metaDetailLevel === "categorical";
}

/**
 * A type guard which helps to distinguish between ExifTool's
 * **full** set of metadata versus other levels of detail.
 */
export function hasTagsMetadata(meta: ImageMetadata): meta is IExifToolMeta {
  return meta.metaDetailLevel === "tags";
}

export function hasAllMetaData(meta: ImageMetadata): meta is IAllImageMeta {
  return meta.metaDetailLevel === "all";
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
