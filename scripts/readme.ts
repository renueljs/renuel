import { exec } from "child_process";
import fs from "fs/promises";
import { text } from "stream/consumers";

async function run(cmd: string) {
  try {
    const { stdout } = await exec(cmd, { encoding: "utf8" });
    return stdout ? await text(stdout) : null;
  } catch (error) {
    console.error(
      `Error executing command: ${cmd}`,
      ...(error instanceof Error ? [error.message] : []),
    );
    process.exit(1);
  }
}

async function getBranch() {
  const branch = await run("git rev-parse --abbrev-ref HEAD");
  return branch?.trim();
}

async function main() {
  const repo = process.argv.reduce(
    (acc, arg) => (acc === "" ? arg : arg === "--repo" ? "" : acc),
    null as string | null,
  );

  if (
    !repo ||
    !/^([a-z0-9](?:-?[a-z0-9]){0,38})\/([a-z0-9](?:-?[a-z0-9]){0,38})$/.test(
      repo,
    )
  ) {
    throw new Error(
      "Must pass --repo argument with valid GitHub repository in the format <owner>/<repo>.",
    );
  }

  const branch = await getBranch();

  let readme = await fs.readFile("./README.md", "utf8");

  readme = Array.from(readme.matchAll(/<img[^>]+alt="Renuel"([\S\s]*?)>/gm))
    .sort(({ index: a }, { index: b }) => (a < b ? 1 : a > b ? -1 : 0))
    .reduce((readme, match) => {
      const before = readme.substring(0, match.index);
      const after = readme.substring(match.index + match[0].length);

      if (match[0].includes("#gh-light-mode-only")) {
        const src = (match[1].match(/src="([^"]+)"/) || [])[1];

        if (!src) {
          return before + after;
        }

        const resolved = new URL(
          src,
          `https://github.com/${{ repo }}/raw/${branch}`,
        )
          .toString()
          .replace(/#gh-light-mode-only/g, "");

        return before + match[0].replace(src, resolved) + after;
      }

      return before + after;
    }, readme);

  readme = Array.from(
    readme.matchAll(
      new RegExp(
        `<!-- omit from ${branch} -->([\\S\\s]*?)<!-- \\/omit from ${branch} -->`,
        "gm",
      ),
    ),
  )
    .sort(({ index: a }, { index: b }) => (a < b ? 1 : a > b ? -1 : 0))
    .reduce(
      (readme, match) =>
        readme.substring(0, match.index) +
        readme.substring(match.index + match[0].length),
      readme,
    );

  await fs.writeFile("./README.md", readme, "utf8");
}

main().catch(e => {
  console.error(e.message);
  process.exit(1);
});
