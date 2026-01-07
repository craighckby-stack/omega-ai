import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
});

const OFF = "off";

export default [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      "@typescript-eslint/no-explicit-any": OFF,
      "@typescript-eslint/no-unused-vars": OFF,
      "@typescript-eslint/no-non-null-assertion": OFF,
      "@typescript-eslint/ban-ts-comment": OFF,
      "@typescript-eslint/prefer-as-const": OFF,
      "react-hooks/exhaustive-deps": OFF,
      "react/no-unescaped-entities": OFF,
      "react/display-name": OFF,
      "react/prop-types": OFF,
      "@next/next/no-img-element": OFF,
      "@next/next/no-html-link-for-pages": OFF,
      "prefer-const": OFF,
      "no-unused-vars": OFF,
      "no-console": OFF,
      "no-debugger": OFF,
      "no-empty": OFF,
      "no-irregular-whitespace": OFF,
      "no-case-declarations": OFF,
      "no-fallthrough": OFF,
      "no-mixed-spaces-and-tabs": OFF,
      "no-redeclare": OFF,
      "no-undef": OFF,
      "no-unreachable": OFF,
      "no-useless-escape": OFF,
    },
  },
];