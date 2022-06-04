const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const CssMinimizerPlugin = require("mini-css-extract-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const Dotenv = require('dotenv-webpack')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
module.exports = {
  //nuestro punto de entrada
  entry: "./src/index.js",
  output: {
    //saber donde se encuentra el proyecto
    //donde se almacenara
    path: path.resolve(__dirname, "dist"),

    filename: "[name].[contenthash].js",
    assetModuleFilename: 'assets/images/[hash][ext]'
  },
  mode: 'development',
  devtool: 'source-map',
  
  resolve: {
    extensions: [".js"],
    alias:{
      '@utils' : path.resolve(__dirname,'src/utils/'),
      '@templates' : path.resolve(__dirname,'src/templates/'),
      '@styles' : path.resolve(__dirname,'src/styles/'),
      '@images' : path.resolve(__dirname,'src/assets/images/')
    }
  },
  module: {
    rules: [
      {
        test: /\.m?.js$/,
        //nada de node modules porque error
        exclude: /node_modules/,
        //pasamos el loader
        use: {
          loader: "babel-loader",
        },
      },
      {
        //anadimos plugin y configuracion para css
        test: /\.css|.styl$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "stylus-loader"],
      },
      {
        //pasamos la expresion regular para archivos png
        test: /\.png/,

        type: "asset/resource",
      },
      {
        test: /\.(woff|woff2)$/,
        use: {
          loader: "url-loader",
          options: {
            limit: 10000, // O LE PASAMOS UN BOOLEANOS TRUE O FALSE
            // Habilita o deshabilita la transformación de archivos en base64.
            mimetype: "aplication/font-woff",
            // Especifica el tipo MIME con el que se alineará el archivo.
            // Los MIME Types (Multipurpose Internet Mail Extensions)
            // son la manera standard de mandar contenido a través de la red.
            name: "[name].[contenthash].[ext]",
            // EL NOMBRE INICIAL DEL ARCHIVO + SU EXTENSIÓN
            // PUEDES AGREGARLE [name]hola.[ext] y el output del archivo seria
            // ubuntu-regularhola.woff
            outputPath: "./assets/fonts/",
            // EL DIRECTORIO DE SALIDA (SIN COMPLICACIONES)
            publicPath: "../assets/fonts/",
            // EL DIRECTORIO PUBLICO (SIN COMPLICACIONES)
            esModule: false,
            // AVISAR EXPLICITAMENTE SI ES UN MODULO
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      inject: true,
      template: "./public/index.html",
      filename: "./index.html",
    }),
    new MiniCssExtractPlugin({
      filename: 'assets/[name].[contenthash].css'
    }),
    new CopyPlugin({
      patterns: [
        {
          //desde donde
          from: path.resolve(__dirname, "src", "assets/images"),
          to: "assets/images",
        },
      ],
    }),
    new Dotenv(),
    new BundleAnalyzerPlugin(),
  ],
  devServer: {
    static: path.join(__dirname, 'dist'),
    compress: true,
    historyApiFallback: true,
    port: 3006,

  }
};
