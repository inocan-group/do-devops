import smartwrap from "smartwrap"; // https://github.com/tecfu/smartwrap#readme
export interface IWordWrapOptions {
  /**
   * Remove any existing CR's in text before applying
   * word wrap.
   */
  removeExistingCR?: boolean;
  /**
   * the number of characters after which whitespace will be looked for
   * to wrap the text. Default is **80**.
   */
  wrapDistance?: number;
}

/**
 * Word wraps text after a certain number of characters is reached.
 */
export function wordWrap(text: string, options: IWordWrapOptions = {}) {
  text = options.removeExistingCR ? text.replace(/\n/g, "") : text;

  return smartwrap(text, { width: options.wrapDistance || 80 });
}
