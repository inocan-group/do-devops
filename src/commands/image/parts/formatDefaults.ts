import { ImageFormatOptions } from "~/@types";

export const formatDefaults: ImageFormatOptions = {
  jpg: {
    mozjpeg: true,
    progressive: true,
    quality: 75
  },
  webp: {
    quality: 75
  },
};