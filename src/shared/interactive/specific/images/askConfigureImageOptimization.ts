import chalk from "chalk";
import path from "node:path";
import { IImageRule, Observations } from "src/@types";
import { saveProjectConfig } from "src/shared/config";
import { csvParser } from "src/shared/data";
import { currentDirectory } from "src/shared/file";
import { getImages } from "src/shared/images";
import { wordWrap } from "src/shared/ui";
import {
  askConfirmQuestion,
  askInputQuestion,
  askListQuestion,
  askForNestedDirectory,
} from "src/shared/interactive";
import { logger } from "src/shared/core";

const filter = (v: string) => !v.startsWith(".") && v !== "node_modules";

/**
 * interactive session intended for project which does NOT
 * have any config for images yet.
 */
export async function askConfigureImageOptimization(_o: Observations) {
  const log = logger();
  const images = getImages(currentDirectory());
  const imageDirs = new Set<string>();
  for (const i of images) {
    imageDirs.add(path.dirname(i));
  }

  log.shout(
    wordWrap(
      `Welcome weary traveler! It appears you've not configured ${chalk.bold.blue`images`} for this repo before. Let's get that out of the way now.\n`
    )
  );

  const sourceDir = await askForNestedDirectory(
    wordWrap(
      `You are expected to choose a ${chalk.blue`source directory`} to act as the ${chalk.italic`default`} dir for all your rule's source images. Choose from the directories below (${chalk.italic`dirs with image will be at top of list`}):`
    ),
    {
      name: "Source Directory",
      filter,
      leadChoices: [...imageDirs],
    }
  );
  log.info();

  const destinationDir = await askForNestedDirectory(
    wordWrap(
      `Now choose a ${chalk.italic`default`} ${chalk.blue`destination directory`} for images; ${chalk.bold`rules`} will still need choose this too but they'll default to whatever you choose.\n\n`
    ) +
      wordWrap(
        `Note: the most common directory to target would be the ${chalk.blue`/public`} directory as this is typically where build tools look for static assets like images.`
      ) +
      `\n\nChoose from list:`,
    {
      name: "Destination Directory",
      filter,
      leadChoices: ["public"],
    }
  );

  log.info();
  log.shout(
    wordWrap(
      `The ${chalk.italic`general`} configuration of the image service is now complete but ${chalk.italic`rules`} are a key component of having a complete setup. For this reason we will add one rule now and if you want to add more later simply run ${chalk.blue`dd image config`} again and choose "add rule" from the options.\n\n`
    )
  );

  const rule: Partial<IImageRule> = {};

  rule.name = await askInputQuestion(
    `Each rule needs to have a "name" to identify it (you can change later without issue):`
  );

  rule.source = await askForNestedDirectory(
    wordWrap(
      `Each rule must state a root directory for their ${chalk.bold.blue`source`} images;\nit is already defaulted to the general setting you chose earlier but if this rule should start somewhere else feel free to change`
    ),
    { name: "Rule Source Directory", filter, leadChoices: [sourceDir] }
  );

  rule.destination = await askForNestedDirectory(
    `Similarly, a rule has a default ${chalk.bold.blue`destination`} directory`,
    { name: "Rule Destination Directory", filter, leadChoices: [destinationDir] }
  );

  rule.glob = await askInputQuestion(
    wordWrap(
      `Finally, a rule must express a "glob pattern" for picking up the images it sees as source images (the glob pattern will be applied in the source directory you just chose). An example glob pattern to find all PNG images recursively would be ${chalk.bgWhite.blackBright(
        "**/*.png"
      )}: `
    )
  );

  const sizeOptions = [
    "high-quality [ 1024, 1280, 1536, 2048, 2560 ]",
    "full-width [ 640, 768, 1024, 1280, 1536 ]",
    "half-width [ 320, 384, 512, 640, 768 ]",
    "quarter-width [ 160, 192, 256, 320, 384 ]",
    "icon [ 128, 192, 256, 512 ]",
    "custom",
  ];

  const sizeName = await askListQuestion(
    wordWrap(
      `When a source image is optimized it will be converted to JPG, AVIF, and WebP formats but it will also be done in different sizes. There are a number of default options listed below which largely trigger off of two variables:\n`
    ) +
      ` 1. the responsive breakpoints we use for responsive design\n  2. the idea of what percentage the screen width the image will typically occupy\n\n` +
      wordWrap(
        `Note:\n  - some smaller displays ${chalk.italic`do`} have much higher DPI so they can display high resolution;\n  - also due to ${chalk.italic`responsive design`} sometimes smaller displays take up more width on a percentage basis\n\nChoose from the defaults or design your own:`
      ),
    sizeOptions,
    { default: "full-width [ 640, 768, 1024, 1280, 1536 ]" }
  );
  if (sizeName === "custom") {
    const customName = await askInputQuestion(`Add your own values as CSV (e.g., "64,128,256"):`);
    rule.widths = csvParser<number[]>(customName);
  } else {
    rule.widths = JSON.parse(sizeName.replace(/.*\[/, "["));
  }

  rule.preBlur = await askConfirmQuestion(
    `Should images in this rule also generate a small blurred image for pre-loading?`
  );

  rule.metaDetail = await askListQuestion(
    `What level of detail will this rule need for metadata?`,
    ["basic", "categorical", "tags"] as const
  );

  rule.sidecarDetail = await askListQuestion(
    wordWrap(
      `Sometimes it's helpful to have a "sidecar" file which has meta data as a JSON. This could be a JSON file per directory or one per file. If you don't need it though -- in most cases you won't -- then just choose "none":`
    ),
    ["none", "per-image", "per-rule"] as const,
    { default: "none" }
  );

  const rules = [rule as IImageRule];

  saveProjectConfig({
    image: {
      sourceDir,
      destinationDir,
      rules,
      defaultWidths: [640, 768, 1024, 1280, 1536],
      formatOptions: {
        jpg: { mozjpeg: true, quality: 60 },
        avif: { quality: 30 },
        webp: { quality: 40 },
      },
      sidecar: "none",
    },
  });

  log.info(
    `\n\nFantastic, you have default properties configured {bold plus} your first rule defined!\n`
  );
  log.info(`- to convert images run ${chalk.blue`dd image optimize`} and your rule will be executed.`);
  log.info(
    `- the ${chalk.blue`.do-devop.json`} file in the root of the repo will host your configuration.`
  );
  log.info(
    `- you can always edit the config directly in the config file or if you prefer use the ${chalk.blue`dd image config`} menu`
  );

  return { sourceDir, targetDir: destinationDir, rules };
}
