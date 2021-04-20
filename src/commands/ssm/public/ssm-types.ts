import { IGlobalOptions } from "~/shared/options";

export interface ISsmOptions extends IGlobalOptions {
  /** whether to encode/decode to base64 */
  base64: boolean;
  region?: string;
  profile?: string;
  stage?: string;
  nonStandardPath?: boolean;
  force?: boolean;
  /** the description to use when _adding_ an SSM variable */
  description?: string;
}
