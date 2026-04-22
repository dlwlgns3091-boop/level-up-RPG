import { migrate } from "./schema";
import { seedDefaultTemplatesIfNeeded } from "./seed";

let initialized = false;

export function initDb(): void {
  if (initialized) return;
  migrate();
  seedDefaultTemplatesIfNeeded();
  initialized = true;
}
