module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  extends: ["google", "plugin:prettier/recommended"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  plugins: ["@typescript-eslint"],
  rules: {
    "new-cap": "off",
    "require-jsdoc": "off",
  },
};
