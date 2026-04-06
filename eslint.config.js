// // .eslintrc.js
// // @ts-check
// const eslint = require("@eslint/js");
// const { defineConfig } = require("eslint/config");
// const tseslint = require("typescript-eslint");
// const angular = require("angular-eslint");

// module.exports = defineConfig([
//   {
//     files: ["**/*.ts"],
//     extends: [
//       eslint.configs.recommended,
//       tseslint.configs.recommended,
//       tseslint.configs.stylistic,
//       angular.configs.tsRecommended,
//     ],
//     processor: angular.processInlineTemplates,
//     rules: {
//       // Angular component/directive naming rules
//       "@angular-eslint/directive-selector": [
//         "error",
//         {
//           type: "attribute",
//           prefix: "app",
//           style: "camelCase",
//         },
//       ],
//       "@angular-eslint/component-selector": [
//         "error",
//         {
//           type: "element",
//           prefix: "app",
//           style: "kebab-case",
//         },
//       ],

//       // Downgrade or ignore aggressive errors
//       "@angular-eslint/prefer-inject": "warn", // only warn, don't block build
//       "@typescript-eslint/no-unused-vars": [
//         "warn",
//         {
//           "argsIgnorePattern": "^_", // ignore unused variables starting with _
//           "varsIgnorePattern": "^_", // ignore unused vars starting with _
//           "caughtErrorsIgnorePattern": "^_"
//         }
//       ]
//     },
//   },
//   {
//     files: ["**/*.html"],
//     extends: [
//       angular.configs.templateRecommended,
//       angular.configs.templateAccessibility,
//     ],
//     rules: {
//       // optional: you can turn off template warnings if too noisy
//       "@angular-eslint/template/no-negated-async": "off"
//     },
//   }
// ]);