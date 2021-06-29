/* eslint-disable unicorn/import-style */
import chalk from "chalk";
import { keys } from "native-dash";
import { DoDevopsHandler } from "~/@types";
import { getProjectConfig } from "~/shared/config";
import { logger } from "~/shared/core";
import { currentDirectory } from "~/shared/file";
import { getImages, getImageMeta } from "~/shared/images";
import { askConfigureImageOptimization, askConfirmQuestion } from "~/shared/interactive";
import { convertImages } from "./convertImage";
import { IImageOptions } from "./options";
import { preBlurImage } from "./preBlurImage";

export const handler: DoDevopsHandler<IImageOptions> = async ({ subCommand, opts, observations }) => {
  const log = logger(opts);
  switch (subCommand) {
    case "list":
      const images = await getImageMeta(...getImages(currentDirectory()));
      const forScreen = keys(images).map(i => images[i]).join("\n");
      log.info(forScreen);
      log.info(chalk`\nInfo:\n  {dim - a} {bold 4:3}  {dim aspect ratio is} {bold 1.333}\n  {dim - a} {bold 16:9} {dim aspect ratio is }{bold 1.777}`);

      break;
    case "convert":
      let config = getProjectConfig();

      if (!config?.image?.sourceDir) {
        const cont = await askConfirmQuestion("To convert images you will need a configuration for the repo; should we set that up now?");
        if (cont) {
          await askConfigureImageOptimization(observations);
          config = getProjectConfig();
        }
      }

      // start running convert rules
      const rules = config?.image?.rules || [];
      if (rules.length === 0) {
        console.log(`This repo has no image rules configured. Edit the ".do-devops.json" file to add rules`);
        return;
      }

      for (const rule of rules) {
        const preBlur = typeof rule.preBlur === "undefined" ? true : rule.preBlur;
        const sources = getImages(rule.source).filter(i => (rule?.exclude || []).every(e => !i.includes(e))).filter(i => (rule?.include || []).every(inc => i.includes(inc)));
        for (const source of sources) {
          log.info(chalk`Processing {blue ${source}} source image`);
          // for (const size of rule.sizes) {
          //   for (const format of rule.formats) {
          //     const s = getFileComponents(source);
          //     const filename = join(
          //       rule.destination,
          //       s.filepath,
          //       `${s.fileWithoutExt}-${size.width}${size.height ? `x${size.height}` : ""}.${format}`
          //     );
          //     if (size.width === "original") {
          //       //
          //     } else {
          //       const sourcefile = join(rule.source, source);
          //       await sharp(sourcefile).toFormat(format).resize({ width: size.width }).toFile(filename);
          //       log.info(chalk`- {blue ${filename}} written to disk`);
          //     }
          //   }
          // }
          await convertImages(opts, source, rule);
        }


        // we have written primary images now but we
        // still need to create blurred images if this
        // is set
        if (preBlur) {
          log.info(chalk`- all primary images are done; now just creating blurred pre-images`);
          for (const source of sources) {
            preBlurImage(opts, source, rule, { format: "jpg", size: 16 });
          }
        }
      }

  }

};