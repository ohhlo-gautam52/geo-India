const webpack = require("webpack");

module.exports = function override(config) {
  config.resolve.fallback = {
    ...config.resolve.fallback,
    process: require.resolve("process/browser"),
    zlib: require.resolve("browserify-zlib"),
    stream: require.resolve("stream-browserify"),
    crypto: require.resolve("crypto-browserify"),
    path: require.resolve("path-browserify"),
    os: require.resolve("os-browserify/browser"),
    buffer: require.resolve("buffer"),
  };
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    }),
  ]);
  return config;
};
