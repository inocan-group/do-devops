import { sync } from "globby";

export function getImages(dir: string) {
  return sync(
    [
      "**/*.gif",
      "**/*.jpg",
      "**/*.jpeg",
      "**/*.png",
      "**/*.avif",
      "**/*.webp",
      "**/*.tiff",
      "**/*.heif",
    ],
    { cwd: dir, onlyFiles: true, gitignore: true }
  );
}
