const reactPlugin = require("eslint-plugin-react");

module.exports = {
  // root: true,
  languageOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
    parserOptions: {
      ecmaFeatures: { jsx: true }
    }
  },
  plugins: { react: reactPlugin },
  rules: {},
  settings: { react: { version: "detect" } }
};
