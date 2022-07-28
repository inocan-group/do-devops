import { createError } from "brilliant-errors";

export const [ImageError] = createError("ImageError", "do-devops")(
  "format",
  "io",
  "conversion"
)()()();
