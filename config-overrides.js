// config-overrides.js
const path = require("path");

module.exports = function override(config, env) {
  // Add fallback resolvers
  config.resolve.fallback = {
    path: require.resolve("path-browserify"),
    fs: false,
    stream: require.resolve("stream-browserify"),
    util: require.resolve("util/"),
    assert: require.resolve("assert/"),
    constants: require.resolve("constants-browserify"),
    child_process: false,
    // Add more fallback resolvers as needed
  };

  // OR, if you don't need these modules in your client-side code, mark them as external dependencies
  /*
  config.externals = {
    "path": "path",
    "fs": "fs",
    "stream": "stream",
    "util": "util",
    "assert": "assert",
    "constants": "constants",
    "child_process": "child_process",
    // Add more externals as needed
  };
  */

  return config;
};
