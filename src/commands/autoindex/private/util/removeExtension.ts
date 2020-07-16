export function removeExtension(file: string, force: boolean = false) {
  const parts = file.split(".");
  const [fn, ext] =
    parts.length > 2 ? [file.replace("." + parts[parts.length - 1], ""), parts[parts.length - 1]] : file.split(".");

  return fn;
}

export function removeAllExtensions(files: string[]) {
  return files.map((f) => removeExtension(f));
}
