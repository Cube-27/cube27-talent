import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import astro from "eslint-plugin-astro";
import jsxA11y from "eslint-plugin-jsx-a11y";

export default [
  {
    ignores: [
      "dist/**",
      ".astro/**",
      ".wrangler/**",
      "node_modules/**",
      "docs/mockup/**",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  {
    // Config files and Pages Functions run outside the browser.
    files: ["*.{js,mjs,ts}", "functions/**/*.ts"],
    languageOptions: {
      globals: { ...globals.node },
    },
  },
  {
    files: ["**/*.{js,ts,astro}"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: { "jsx-a11y": jsxA11y },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "no-console": ["warn", { allow: ["warn", "error"] }],
    },
  },
];
