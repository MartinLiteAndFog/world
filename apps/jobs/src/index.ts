import { runNormalizeCommand } from "./commands/normalize.js";
import { runSeedCommand } from "./commands/seed.js";
import { runScoreCommand } from "./commands/score.js";

const command = process.argv[2];

if (command === "seed") {
  await runSeedCommand();
} else if (command === "normalize") {
  await runNormalizeCommand();
} else if (command === "score") {
  await runScoreCommand();
} else {
  throw new Error(`Unknown jobs command: ${command ?? "undefined"}`);
}
