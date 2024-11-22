import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    files: ["**/*.{js,mjs,cjs,ts}"],
  },
  {
    languageOptions: {
      globals: globals.browser,
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      // Disable unused variable warnings for JavaScript
      "no-unused-vars": "off",
      // Disable unused variable warnings for TypeScript
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
];
