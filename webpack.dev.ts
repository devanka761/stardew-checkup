import path from "path"
import webpack from "webpack"
import HtmlWebpackPlugin from "html-webpack-plugin"
import MiniCssExtractPlugin from "mini-css-extract-plugin"
import { CleanWebpackPlugin } from "clean-webpack-plugin"

interface IAppConfigEntries {
  title: string
  filename: string
  template: string
  chunks: string[]
}

interface IAppConfig {
  entry: webpack.EntryObject
  entries: {
    [key: string]: IAppConfigEntries
  }
}

type IPlugins = (CleanWebpackPlugin | MiniCssExtractPlugin | HtmlWebpackPlugin)[]

const appConfig: IAppConfig = {
  entry: {
    app: "./src/ts/app.ts"
  },
  entries: {
    app: {
      title: "app",
      filename: "index.html",
      template: "app.html",
      chunks: ["app"]
    }
  }
}

const plugins: IPlugins = [
  new CleanWebpackPlugin(),
  new MiniCssExtractPlugin({
    filename: "[name].css"
  })
]

Object.values(appConfig.entries).forEach((entryInfo, _entryName) => {
  plugins.push(
    new HtmlWebpackPlugin({
      title: entryInfo.title,
      filename: path.join(__dirname, "./public/" + entryInfo.filename),
      template: "./templates/" + entryInfo.template,
      chunks: entryInfo.chunks,
      publicPath: "/bundle",
      chunksSortMode: "manual",
      inject: "head",
      scriptLoading: "defer"
    })
  )
})

const entry = {
  ...appConfig.entry
}

const config: webpack.Configuration = {
  mode: "development",
  entry,
  output: {
    path: path.resolve(__dirname, "public/bundle"),
    filename: "[name].js",
    iife: false,
    clean: true
  },
  plugins,
  resolve: {
    extensions: [".ts", ".js", ".scss"]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-typescript"]
          }
        }
      },
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
      }
    ]
  },
  watch: true
}

export default config
