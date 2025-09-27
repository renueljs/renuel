// @ts-check

import eslint from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import prettierConfig from "eslint-config-prettier/flat";
import import_ from "eslint-plugin-import";
import prettier from "eslint-plugin-prettier";
import importSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  tseslint.configs.recommended,
  {
    plugins: {
      "@typescript-eslint": tsPlugin,
      import: import_,
      prettier,
      "simple-import-sort": importSort,
      "unused-imports": unusedImports,
    },
    rules: {
      "prettier/prettier": ["error"],
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            ["^\\u0000"], // side effect imports
            ["^import\\s+type"], // type-only imports
            ["^@?\\w"], // packages
            ["^\\."], // relative imports
          ],
        },
      ],
      "simple-import-sort/exports": "error",
      "unused-imports/no-unused-imports": "error",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "no-unused-vars": "off",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", disallowTypeAnnotations: false },
      ],
      "import/extensions": [
        "error",
        "ignorePackages",
        {
          js: "never",
          jsx: "never",
          tsx: "never",
        },
      ],
    },
  },
  prettierConfig,
  { ignores: ["dist", "node_modules"] },
);
