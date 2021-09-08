import { globbySync } from "globby";

export function getImages(dir: string) {
  return globbySync(
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
