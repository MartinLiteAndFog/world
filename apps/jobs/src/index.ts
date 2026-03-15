import { runNormalizeCommand } from "./commands/normalize.js";
import { runSeedCommand } from "./commands/seed.js";
import { runScoreCommand } from "./commands/score.js";

const command = process.argv[2];
const args = process.argv.slice(3);

function readCitySlugs(argv: string[]): ("new-york" | "berlin" | "london")[] | undefined {
  const collected: ("new-york" | "berlin" | "london")[] = [];

  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];

    if (value.startsWith("--city=")) {
      collected.push(value.replace("--city=", "") as "new-york" | "berlin" | "london");
      continue;
    }

    if (value === "--city" && argv[index + 1]) {
      collected.push(argv[index + 1] as "new-york" | "berlin" | "london");
      index += 1;
    }
  }

  return collected.length > 0 ? collected : undefined;
}

if (command === "seed") {
  await runSeedCommand({
    citySlugs: readCitySlugs(args)
  });
} else if (command === "normalize") {
  await runNormalizeCommand();
} else if (command === "score") {
  await runScoreCommand();
} else {
  throw new Error(`Unknown jobs command: ${command ?? "undefined"}`);
}
