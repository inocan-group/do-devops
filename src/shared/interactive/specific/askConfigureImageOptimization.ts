import chalk from "chalk";
import { AspectRatioColon } from "common-types";
import path from "path";
import { IFixedAspectRatio, IImageRule, ImageFitChangingAspect, ImageFitUnchangedAspect, ImageFormat, ImageTargetSize, IUnchangedAspectRatio, Observations } from "~/@types";
import { getProjectConfig, saveProjectConfig } from "~/shared/config";
import { currentDirectory, getSubdirectories } from "~/shared/file";
import { getImages } from "~/shared/images";
import { askCheckboxQuestion, askConfirmQuestion, askInputQuestion, askListQuestion } from "../general";

export async function askConfigureImageOptimization(_o: Observations) {
  const current = getProjectConfig();

  const images = getImages(currentDirectory());
  const imageDirs = new Set<string>();
  for (const i of images) {
    imageDirs.add(path.dirname(i));
  }

  let sourceDir = await askListQuestion<string>(`You are expected to choose a base directory for {italic source} images. Choose from the directories below:`, [...imageDirs, "other", "QUIT"]);
  if (sourceDir === "QUIT") {
    process.exit();
  }
  if (sourceDir === "other") {
    sourceDir = await askInputQuestion("What directory do you want to use?");
  }

  const subDirs = getSubdirectories(currentDirectory());

  let targetDir = await askListQuestion<string>(`You aren't required to have a target directory because each "rule" can point to a different location. However, it's often a good idea to state one to reduce boilerplate in the rules.`, [...subDirs, "other", "QUIT"]);

  if (targetDir === "QUIT") {
    process.exit();
  }
  if (targetDir === "other") {
    targetDir = await askInputQuestion("Which directory?");
  }

  console.log(`We will start by creating just one rule. In many cases this is all you need but if you want to add more you can by modifying the ".do-devops.json" file directly.\n\n`);

  const name = await askInputQuestion(`Each rule needs to have a "name" to identify it (you can change later without issue):`);

  const formats = await askCheckboxQuestion<ImageFormat>(`The first thing we need to determine is what image formats do you want to convert into?`, ["gif", "jpg", "png", "webp", "avif", "dzi", "tiff", "heif"], { default: ["jpg", "webp", "avif"] });

  const maintainAspectRatio = await askConfirmQuestion(`When we resize these images, should we maintain aspect ratio or use a fixed ratio?`);

  let sizes: ImageTargetSize[];
  let fit: ImageFitChangingAspect | ImageFitUnchangedAspect;

  let rule: IImageRule;

  if (maintainAspectRatio) {
    const widths: string[] = await askCheckboxQuestion("Choose the widths you want to resize to", ["32", "64", "128", "256", "512", "768", "1024", "1200", "1800", "original"]);
    sizes = widths.map(i => ({ width: i === "original" ? i : Number(i) }));
    rule = { name, source: sourceDir, destination: targetDir, subDirs: true, formats, exclude: [], include: [], sizes } as IUnchangedAspectRatio;
  } else {
    fit = await askListQuestion<ImageFitChangingAspect>("Choose a method to address how to handle the aspect ratio changing", ["cover", "contain", "fill"]);
    let aspectRatio = await askListQuestion<AspectRatioColon | "other">("What aspect ratio should the converted image be converted to:", ["1:1", "4:3", "16:9", "16:10", "2:1", "1:2", "3:1", "1:3", "other"]);
    if (aspectRatio === "other") {
      aspectRatio = await askInputQuestion(chalk`What is the aspect ratio (use x:y syntax)?`) as AspectRatioColon;
    }
    sizes = [{ width: 1024, height: 768 }];
    rule = { name, source: sourceDir, destination: targetDir, subDirs: true, formats, exclude: [], include: [], fit, sizes, aspectRatio } as IFixedAspectRatio;
  }

  const rules: IImageRule[] = current?.image?.rules ? [...current.image.rules, rule] : [rule];

  saveProjectConfig({ image: { sourceDir, targetDir, rules } });

  return { sourceDir, targetDir, rules };
}