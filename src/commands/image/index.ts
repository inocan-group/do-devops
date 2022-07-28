import type { IDoDevopsCommand } from "src/@types";
import { IImageOptions, handler, options } from "./parts";

const command: IDoDevopsCommand<IImageOptions> = {
  kind: "image",
  handler,
  description:
    "Provides an image optimization solution leveraging image resizing, blurring, and more.",
  greedy: false,
  options,
  subCommands: [
    { name: "optimize", summary: "optimize/convert images based on configured rules" },
    {
      name: "watch",
      summary: "watch file system for changes to source images and optimize when changed",
    },
    { name: "config", summary: "configure rules for optimizing the images in this repo" },
    { name: "summarize", summary: "summarize the current configuration" },
  ],
};

export default command;
