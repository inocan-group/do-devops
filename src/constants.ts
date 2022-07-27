import { TestObservation } from "./@types";
export const IMAGE_CACHE = ".image-metadata.json";

export const TEST_FRAMEWORKS: readonly TestObservation[] = [
  "mocha",
  "jest",
  "uvu",
  "ava",
  "jasmine",
  "qunit",
  "vitest",
];

export const FNS_TYPES_FILE = "src/@types/aws-functions.ts";
export const STEP_FNS_TYPES_FILE = "src/@types/aws-step-fns.ts";
