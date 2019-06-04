import { getConfig } from "../shared";

export async function handler() {
  const config = await getConfig();
}
