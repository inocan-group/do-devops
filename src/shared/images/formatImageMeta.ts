import chalk from "chalk";
import type { IImageMetadata } from "~/@types/image-types";
import { highlightFilepath, durationSince } from "~/shared/ui";

export function formatImageMeta(image: IImageMetadata) {
  const ratio =
    image.meta.width && image.meta.height
      ? chalk`, {italic aspect: {dim ${
          Math.round((image.meta.width / image.meta.height) * 100) / 100
        }}}`
      : "";
  const dimensions = chalk`{bold ${image.meta.width}} {italic x} {bold ${image.meta.height}}${ratio}`;
  const progressive = image.meta.isProgressive ? chalk` {gray |} {italic progressive}` : "";
  const animated =
    image.meta.pages && image.meta.pages > 1 ? chalk` {gray |} {italic animated}` : "";
  const color = chalk`${image.meta.space}${
    image.meta.chromaSubsampling ? `, ${image.meta.chromaSubsampling}` : ""
  }`;
  const kb = image.size / 1000;
  const imageSize =
    kb >= 1000 ? chalk`${Math.round(kb / 1000)} {bold {red mb}}` : chalk`${kb} {gray kb}`;

  return (
    highlightFilepath(image.file) +
    chalk` [ ${dimensions} {gray |} color: {dim ${color}}${progressive}${animated} {gray |} updated: {dim {italic ${durationSince(
      image.updated
    )} ago}} {gray |} size: ${imageSize} ]`
  );
}
