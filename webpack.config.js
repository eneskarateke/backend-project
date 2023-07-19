const path = require("path");
const webpackNodeExternals = require("webpack-node-externals");

module.exports = {
  entry: "./index.js",
  target: "node",
  externals: [webpackNodeExternals()],
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
  },
};
