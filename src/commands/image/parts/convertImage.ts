import sharp from "sharp";
import chalk from "chalk";
import { join } from "path";
import { IGlobalOptions, IImageRule, IConvertImageOptions, ImageFormat, ImageTargetSize, IImageFit as ImageFit } from "~/@types";
import { logger } from "~/shared/core/logger";
import { getFileComponents } from "~/shared/file";
import deepmerge from "deepmerge";
import { formatDefaults } from "./formatDefaults";
import { getImageMeta } from "~/shared/images";

const filename = (base: string) => (format: ImageFormat, size: ImageTargetSize, blur: boolean) => {
  const imgSize = size?.height ? `${size.width}x${size.height}` : `-${size.width}`;
  const blurred = blur ? `-blurred` : "";

  return `${base}${blurred}${imgSize}.${format}`;
};


export async function convertImages(cliOptions: IGlobalOptions, imgSource: string, rule: IImageRule, options: IConvertImageOptions = {}) {
  const log = logger(cliOptions);
  const o = {
    progressive: true,
    blur: false,
    sharpen: { sigma: undefined, flat: undefined, jagged: undefined },
    flatten: false,
    normalize: false,
    grayscale: false,
    chromaSubsampling: "4:2:0",
    preserveMetadata: false,
    removeAlpha: false,
    autoRotate: true,
    printDpi: 300,
    fit: (options.size && Array.isArray(options.size) || options.aspectRatio ? "cover" : "inside") as ImageFit,
    ...options,
    formatOptions: deepmerge(formatDefaults, options.formatOptions || {})
  };

  log.shout(chalk`- converting image { blue ${imgSource} } --as part of the "${rule.name}" rule-- using the following options: ${JSON.stringify(o)} `);
  log.shout(chalk`- this conversion involves the following { bold { yellow sizes } }: ${rule.sizes.map(i => i.height ? `${i.width}x${i.height}` : i.width).join(", ")} `);
  log.shout(chalk`- this conversion will convert to the following { bold { yellow formats } }: ${rule.formats.join(", ")} `);

  const s = getFileComponents(imgSource);
  const sourcefile = join(rule.source, imgSource);
  const offsetDir = s.filepath;
  const destinationDir = join(rule.destination, offsetDir);
  const fn = filename(join(destinationDir, s.fileWithoutExt));
  const simd = sharp.simd();

  if (simd) {
    log.shout(chalk`- the {bold {yellow SIMD}} instruction set is available and will be used`);
  } else {
    log.shout(chalk`{dim - the {bold {yellow SIMD}} instruction set is {italic not} available on this platform}`);
  }

  const cache = getImageMeta()

  const promises = [];
  for (const size of rule.sizes) {
    const resize = size.width === "original" && (!size.height || size.height === "original") ? false : true;
    for (const format of rule.formats) {
      const prep = o.preserveMetadata ? sharp(sourcefile).withMetadata({ density: o.printDpi }) : sharp(sourcefile);
      const transform = o.autoRotate ? prep.rotate() : prep;

      const p = resize
        // resizing part of process
        ? transform.toFormat(format, { progressive: o.progressive }).resize(size.width === "original" ? undefined : size.width, size.height === "original" ? undefined : size.height, { fit: o.fit }).blur(o.blur).sharpen(o?.sharpen.sigma, o.sharpen.flat, o.sharpen.jagged).normalize(o.normalize).grayscale(o.grayscale).toFile(fn(format, size, o.blur ? true : false))
        // no resizing
        : transform.toFormat(format, { progressive: o.progressive }).blur(o.blur).sharpen(o?.sharpen.sigma, o.sharpen.flat, o.sharpen.jagged).normalize(o.normalize).grayscale(o.grayscale).toFile(fn(format, size, o.blur ? true : false));

      promises.push(p);
    }
  }

  log.shout(chalk`{gray ${sharp.counters()}}`);
  log.info(chalk`- waiting for all {bold {yellow ${promises.length}}} files to be written`);
  const done = await Promise.all(promises);
  console.log({ done });
}