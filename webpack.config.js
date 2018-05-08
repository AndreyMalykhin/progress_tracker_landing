const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const isDevEnv = process.env.NODE_ENV === "development";
let devtool = "inline-source-map";

if (!isDevEnv) {
  devtool = "source-map";
}

module.exports = {
  mode: process.env.NODE_ENV,
  devtool,
  module: {
    rules: [
      {
        test: /\.svg$/,
        loader: 'svg-inline-loader'
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192,
              name: "[name].[hash].[ext]"
            }
          }
        ]
      },
      {
        test: /\.(scss)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              minimize: !isDevEnv
            }
          },
          {
            loader: "postcss-loader",
            options: {
              plugins: function() {
                return [require("precss"), require("autoprefixer")];
              }
            }
          },
          {
            loader: "sass-loader"
          }
        ]
      }
    ]
  },
  resolve: {
    modules: [path.resolve(__dirname, "src"), "node_modules"]
  },
  entry: {
    bundle: path.resolve(__dirname, "src", "styles", "index.scss")
  },
  output: {
    path: path.resolve(__dirname, "build")
  },
  plugins: [
    new CleanWebpackPlugin([path.resolve(__dirname, "build")]),
    new MiniCssExtractPlugin({
      filename: "[name].[hash].css"
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "src", "index.ejs"),
      inject: false
    })
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        styles: {
          name: "bundle",
          test: /\.scss$/,
          chunks: "all",
          enforce: true
        }
      }
    }
  }
};
