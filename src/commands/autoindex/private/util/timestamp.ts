import { format } from "date-fns";

export function timestamp() {
  return `// indexed at: ${format(Date.now(), "Mo MMM, yyyy, hh:mm a ( O )")}\n`;
}
