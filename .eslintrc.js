module.exports = {
  env: {
    browser: true,
    es2021: true,
    "jest/globals": true,
  },
  extends: ["airbnb-base", "prettier"],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["jest", "@typescript-eslint"],
  rules: {
    "import/prefer-default-export": "off",
    "max-len": [
      "error",
      {
        ignoreComments: true,
      },
    ],
    "import/no-unresolved": "off",
    "import/extensions": ["warn", "never"],
  },
};
