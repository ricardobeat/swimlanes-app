import { defineConfig } from "eslint/config";
import tslint from "@electron-toolkit/eslint-config-ts";
import svelte from "eslint-plugin-svelte";
import ts from "typescript-eslint";

export default defineConfig([
  {
    ignores: [".vite/", "dist/"],
  },
  ...tslint.configs.recommended,
  ...svelte.configs.recommended,
  {
    files: ["**/*.svelte", "**/*.svelte.ts"],
    languageOptions: {
      parserOptions: {
        extraFileExtensions: [".svelte", ".svelte.ts"],
        parser: ts.parser,
      },
    },
  },
]);
