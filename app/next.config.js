const withTM = require("next-transpile-modules")(["ky"]);

module.exports = withTM({
  future: {
    webpack5: false,
  },
});
