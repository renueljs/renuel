/* eslint-disable-next-line no-undef */
module.exports = {
  rules: {
    "type-enum": [
      2,
      "always",
      ["fix", "feat", "BREAKING CHANGE", "misc", "revert"],
    ],
    "type-case": [2, "always", "lower-case"],
    "type-empty": [2, "never"],
  },
};
