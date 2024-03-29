
import chalk from "chalk";
import { IImageRule, IProjectConfig, Observations } from "src/@types";
import { getProjectConfig, saveProjectConfig } from "src/shared/config";
import { logger } from "src/shared/core/logger";
import { csvParser } from "src/shared/data";
import { ImageApi } from "src/shared/images/useImageApi";
import { wordWrap } from "src/shared/ui";
import {
  askConfirmQuestion,
  askForNestedDirectory,
  askInputQuestion,
  askListQuestion,
} from "../../general";
import { askImageConfiguration } from "./askImageConfiguration";

const filter = (v: string) => !v.startsWith(".") && v !== "node_modules";

export async function askAddImageRule(o: Observations, api: ImageApi) {
  const log = logger();
  const config = getProjectConfig().image as Exclude<IProjectConfig["image"], undefined>;
  const rule: Partial<IImageRule> = {};

  rule.name = await askInputQuestion(`What will the new rule be called:`);
  rule.source = await askForNestedDirectory(
    wordWrap(`What is the root directory for ${chalk.bold.blue`source images`}?`),
    { name: "Source Directory", filter, leadChoices: [config.sourceDir] }
  );
  rule.destination = await askForNestedDirectory(
    `What is the root directory for ${chalk.bold.blue`destination images`}?`,
    { name: "Destination Directory", filter, leadChoices: [config.destinationDir] }
  );
  rule.glob = await askInputQuestion(
    wordWrap(`What is the ${chalk.italic`glob pattern`} used to identify the images: `)
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
    wordWrap(`What are the sizes you want to convert to?`),
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
    `Should images have a small blurred image produced for pre-loading?`
  );

  rule.metaDetail = await askListQuestion(
    `What level of detail will this rule need for metadata?`,
    ["basic", "categorical", "tags"] as const
  );

  rule.sidecarDetail = await askListQuestion(
    wordWrap(`Choose whether you want a sidecar meta file:`),
    ["none", "per-image", "per-rule"] as const,
    { default: "none" }
  );

  await saveProjectConfig("image.rules", [...config.rules, rule as IImageRule]);
  log.info(`- your new rule named "${rule.name}", has been added to project configuration`);
  log.info();
  return askImageConfiguration(o, api);
}
