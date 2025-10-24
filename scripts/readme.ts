import fs from "fs/promises";
import lz from "lz-string";
import { pipe, when } from "remeda";

async function main() {
  const ref = process.argv.find((_, i, argv) => argv[i - 1] === "--ref"),
    npm = process.argv.includes("--npm"),
    dryRun = process.argv.includes("--dry-run");

  if (!ref) {
    throw new Error("Please provide a ref using --ref <ref>");
  }

  await pipe(
    await fs.readFile("./README.md", "utf8"),
    replaceLogos({ ref, npm }),
    replaceBadges({ ref }),
    addSandboxButtons({ ref }),
    when(() => dryRun, {
      onTrue: readme => console.log(readme),
      onFalse: readme => fs.writeFile("./README.md", readme, "utf8"),
    }),
  );
}

main().catch(e => {
  console.error(e.message);
  process.exit(1);
});

const replaceLogos =
  ({ ref, npm }: { ref: string; npm: boolean }) =>
  (readme: string) =>
    readme.replace(
      /<p[^>]+id="logos"[^>]*>([\S\s]*?)<\/p>/m,
      `<p align="center" id="logos">${(npm
        ? [
            `https://github.com/renueljs/renuel/raw/${ref}/.github/logo-light.png`,
          ]
        : [
            ".github/logo-light.png#gh-light-mode-only",
            ".github/logo-dark.png#gh-dark-mode-only",
          ]
      )
        .map(
          src =>
            `\n  <img alt="Renuel" src="${src}" height="384" style="max-width: 100%;">`,
        )
        .join("")}\n</p>`,
    );

const replaceBadges = ({ ref }: { ref: string }) => {
  const refType =
    ref === "latest" || ref === "next"
      ? "branch"
      : /^v[0-9]/.test(ref)
        ? "tag"
        : "ref";

  const color =
    ref === "latest" || /^v[0-9]+\.[0-9]+\.[0-9]+$/.test(ref)
      ? "blue"
      : "orange";

  const published = refType === "branch" || refType === "tag";

  return (readme: string) =>
    readme.replace(
      /<p[^>]+id="badges"[^>]*>([\S\s]*?)<\/p>/m,
      `<p align="center" id="badges">${[
        {
          alt: `${refType} ${ref}`,
          src: `https://img.shields.io/badge/${refType}-${ref.replace(/-/g, "--")}-${color}`,
          href: `https://github.com/renueljs/renuel/tree/${ref}`,
        },
        ...(published
          ? [
              {
                alt: "npm version",
                src:
                  refType === "branch"
                    ? `https://img.shields.io/npm/v/renuel/${ref}.svg?label=npm&color=${color}`
                    : `https://img.shields.io/badge/npm-${ref.replace(/-/g, "--")}-${color}`,
                href: `https://www.npmjs.com/package/renuel/v/${ref.replace(/^v/, "")}`,
              },
              {
                alt: `npm ${ref} version bundle size`,
                src: `https://img.shields.io/bundlephobia/minzip/renuel@${ref}?label=bundle%20size&color=${color}`,
                href: `https://bundlephobia.com/package/renuel@${ref}`,
              },
            ]
          : []),
        {
          alt: "license",
          src: `https://img.shields.io/badge/license-MIT-${color}`,
          href: `https://github.com/renueljs/renuel/blob/${ref}/LICENSE`,
        },
      ]
        .map(
          ({ alt, src, href }) =>
            `\n  <a href="${href}"><img src="${src}" alt="${alt}"></a>`,
        )
        .join("")}\n</p>`,
    );
};

const addSandboxButtons =
  ({ ref }: { ref: string }) =>
  (readme: string) =>
    Array.from(
      readme.matchAll(
        /<!--demo-start-->([\S\s]*?)```typescript([\S\s]*?)```([\S\s]*?)<!--demo-end-->/g,
      ),
    ).reduce((readme, demo) => {
      const [section, _beforeCode, code] = demo;
      const sectionIndex = demo.index;

      const badge = pipe(
        {
          files: {
            "app.html": {
              content: `<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Renuel Demo</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="./main.ts"></script>
  </body>
</html>
`,
            },
            "package.json": {
              content: JSON.stringify(
                {
                  name: "renuel-demo",
                  version: "1.0.0",
                  description: "Renuel demo project",
                  main: "app.html",
                  scripts: {
                    start: "parcel app.html",
                  },
                  dependencies: {
                    "@types/react": "19.2.2",
                    "@types/react-dom": "19.2.2",
                    react: "19.2.0",
                    "react-dom": "19.2.0",
                    parcel: "2.16.0",
                    renuel: ref.replace(/^v/, ""),
                    typescript: "5.9.3",
                  },
                },
                null,
                2,
              ),
            },
            "tsconfig.json": {
              content: JSON.stringify(
                {
                  compilerOptions: {
                    target: "ES2020",
                    useDefineForClassFields: true,
                    module: "ESNext",
                    lib: ["ES2020", "DOM", "DOM.Iterable"],
                    skipLibCheck: true,
                    moduleResolution: "bundler",
                    allowImportingTsExtensions: true,
                    resolveJsonModule: true,
                    isolatedModules: true,
                    noEmit: true,
                    strict: true,
                    noUnusedLocals: true,
                    noUnusedParameters: true,
                    noFallthroughCasesInSwitch: true,
                  },
                  include: ["main.ts"],
                },
                null,
                2,
              ),
            },
            "main.ts": { content: code.trim() },
          },
        },
        JSON.stringify,
        lz.compressToBase64,
        encodeURIComponent,
        x => `https://codesandbox.io/api/v1/sandboxes/define?parameters=${x}`,
        x =>
          `[![Edit in CodeSandbox](https://codesandbox.io/static/img/play-codesandbox.svg)](${x})`,
      );

      const updatedSection = `<!--demo-start-->\n\`\`\`typescript${code}\n\`\`\`\n\n${badge}\n<!--demo-end-->`;

      return `${readme.substring(0, sectionIndex)}${updatedSection}${readme.substring(sectionIndex + section.length)}`;
    }, readme);
