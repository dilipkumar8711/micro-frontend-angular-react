const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const { container } = require("webpack");
const ModuleFederationPlugin = container.ModuleFederationPlugin;

module.exports = {
  mode: "development",
  devtool: "eval", // good for dev
  entry: "./src/index.js",
  devServer: {
    port: 4400,
    hot: false,
    liveReload: true,
    historyApiFallback: true,
    headers: { "Access-Control-Allow-Origin": "*" },
    static: {
      directory: path.join(__dirname, "public"),
    },
  },
  output: {
    publicPath: "http://localhost:4400/", // 🔥 IMPORTANT: absolute remote URL
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  resolve: {
    extensions: [".jsx", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              ["@babel/preset-env"],
              ["@babel/preset-react", { runtime: "automatic" }],
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  plugins: [
    new ModuleFederationPlugin({
      // MUST match 'mfe2' in shell remotes
      name: "mfe2",

      // MUST emit window.mfe2
      library: { type: "var", name: "mfe2" },

      filename: "remoteEntry.js",

      exposes: {
        "./WidgetApp": "./src/bootstrap.js",
      },

      shared: {
        react: { singleton: true, requiredVersion: false },
        "react-dom": { singleton: true, requiredVersion: false },
      },
    }),

    new HtmlWebpackPlugin({
      template: "./public/index.html",
    }),
  ],
};
