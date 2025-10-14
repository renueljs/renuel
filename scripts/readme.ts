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

const logos = (branch: string, npm: boolean): string[] =>
  npm
    ? [
        `https://github.com/renueljs/renuel/raw/${branch}/.github/logo-light.png`,
      ]
    : [
        ".github/logo-light.png#gh-light-mode-only",
        ".github/logo-dark.png#gh-dark-mode-only",
      ];

const badges = (
  gitBranch: string,
): { alt: string; src: string; href: string }[] => {
  const branch = gitBranch === "master" ? "master" : "next",
    tag = branch === "master" ? "latest" : "next",
    color = branch === "master" ? "blue" : "orange";
  return [
    {
      alt: `${branch} branch`,
      src: `https://img.shields.io/badge/branch-${branch}-${color}`,
      href: `https://github.com/renueljs/renuel/tree/${branch}`,
    },
    {
      alt: `${branch} build status`,
      src: `https://img.shields.io/github/actions/workflow/status/renueljs/renuel/ci.yml?branch=${branch}&color=${color}`,
      href: `https://github.com/renueljs/renuel/actions/workflows/ci.yml?query=branch%3A${branch}`,
    },
    {
      alt: `npm ${tag} version`,
      src: `https://img.shields.io/npm/v/renuel/${tag}.svg?label=npm&color=${color}`,
      href: `https://www.npmjs.com/package/renuel/v/${tag}`,
    },
    {
      alt: `npm ${tag} version bundle size`,
      src: `https://img.shields.io/bundlephobia/minzip/renuel@${tag}?label=bundle%20size&color=${color}`,
      href: `https://bundlephobia.com/package/renuel@${tag}`,
    },
    {
      alt: `github ${branch} branch license`,
      src: `https://img.shields.io/github/license/renueljs/renuel?color=${color}`,
      href: `https://github.com/renueljs/renuel/blob/${branch}/LICENSE`,
    },
  ];
};

async function main() {
  const branch = (await run("git rev-parse --abbrev-ref HEAD"))?.trim();

  if (!branch) {
    throw new Error("Failed to get current branch. Exiting.");
  }

  let readme = await fs.readFile("./README.md", "utf8");

  readme = readme.replace(
    /<p[^>]+id="logos"[^>]*>([\S\s]*?)<\/p>/m,
    `<p align="center" id="logos">${logos(
      branch,
      process.argv.includes("--npm"),
    )
      .map(
        src =>
          `\n  <img alt="Renuel" src="${src}" height="384" style="max-width: 100%;">`,
      )
      .join("")}\n</p>`,
  );

  readme = readme.replace(
    /<p[^>]+id="badges"[^>]*>([\S\s]*?)<\/p>/m,
    `<p align="center" id="badges">${badges(branch)
      .map(
        ({ alt, src, href }) =>
          `\n  <a href="${href}">\n    <img src="${src}" alt="${alt}">\n  </a>`,
      )
      .join("")}\n</p>`,
  );

  if (process.argv.includes("--dry-run")) {
    console.log(readme);
  } else {
    return await fs.writeFile("./README.md", readme, "utf8");
  }
}

main().catch(e => {
  console.error(e.message);
  process.exit(1);
});
