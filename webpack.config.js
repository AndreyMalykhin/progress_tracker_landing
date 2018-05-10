const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");

const isDevEnv = process.env.NODE_ENV === "development";
let devtool = "inline-source-map";
const svgLoaders = [
  {
    loader: "svg-inline-loader"
  }
];
const imgLoaders = [
  {
    loader: "url-loader",
    options: {
      limit: 8192,
      name: "[name].[hash].[ext]"
    }
  }
];

if (!isDevEnv) {
  devtool = "source-map";
  const imgOptimizingLoader = {
    loader: "image-webpack-loader",
    options: {
      bypassOnDebug: true,
      svgo: {
        plugins: [
          { removeViewBox: false },
          { removeDimensions: false },
          { convertPathData: false },
          { mergePaths: false }
        ]
      },
      mozjpeg: {
        quality: 85
      }
    }
  };
  svgLoaders.push(imgOptimizingLoader);
  imgLoaders.push(imgOptimizingLoader);
}

module.exports = {
  mode: process.env.NODE_ENV,
  devtool,
  module: {
    rules: [
      {
        test: /\.svg$/,
        use: svgLoaders
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: imgLoaders
      },
      {
        test: /\.(scss|css)$/,
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
    bundle: path.resolve(__dirname, "src", "scripts", "index.js")
  },
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "[name].[hash].js"
  },
  plugins: [
    new CleanWebpackPlugin([path.resolve(__dirname, "build")]),
    new FaviconsWebpackPlugin({
      logo: path.resolve(__dirname, "src", "images", "logo.png"),
      prefix: "icons-[hash]/",
      persistentCache: true,
      inject: true,
      title: "Completoo"
    }),
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
