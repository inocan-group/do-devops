import sharp from "sharp";
import chalk from "chalk";
import { join } from "path";
import { IGlobalOptions, IImageRule, ImageFormat, IPreBlurOptions } from "~/@types";
import { logger } from "~/shared/core/logger";
import { getFileComponents } from "~/shared/file";



export async function preBlurImage(
  cliOptions: IGlobalOptions,
  source: string,
  rule: IImageRule, options: IPreBlurOptions) {
  const o = { format: "jpg" as ImageFormat, blur: true, size: 16, ...options };
  const log = logger(cliOptions);
  const s = getFileComponents(source);
  const sourcefile = join(rule.source, source);
  const blurFilename = join(
    rule.destination,
    s.filepath,
    `${s.fileWithoutExt}-blurred.jpg`
  );
  typeof o.blur === "number"
    ? await sharp(sourcefile).toFormat(o.format).blur(o.blur).resize({ width: o.size }).toFile(blurFilename)
    : await sharp(sourcefile).toFormat(o.format).blur().resize({ width: o.size }).toFile(blurFilename);
  log.info(chalk`{gray - {blue ${blurFilename}} written to disk}`);
}