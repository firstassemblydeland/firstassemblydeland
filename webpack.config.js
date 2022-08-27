const path = require("path");
const fs = require("fs");
const CopyPlugin = require("copy-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    entry: "./src/index.tsx",
    optimization: {
        splitChunks: {
            cacheGroups: {
                styles: {
                    name: "bundle",
                    test: /\.css$/,
                    chunks: "all",
                    enforce: true,
                },
            },
        },
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    {
                        loader: "sass-loader",
                        options: {
                            sassOptions: {
                                includePaths: ["./src", "./node_modules"],
                            },
                        },
                    },
                ],
            },
            {
                test: /\.(gif|png|jpe?g|svg)$/i,
                use: [
                    {
                        loader: "file-loader",
                        options: {
                            name: "[name].[ext]",
                        },
                    },
                    {
                        loader: "image-webpack-loader",
                        options: {
                            bypassOnDebug: true,
                            mozjpeg: {
                                progressive: true,
                                quality: 65,
                            },
                            // optipng.enabled: false will disable optipng
                            optipng: {
                                enabled: false,
                            },
                            pngquant: {
                                quality: [0.3, 0.65],
                                speed: 4,
                            },
                            gifsicle: {
                                interlaced: false,
                            },
                        },
                    },
                ],
            },
            {
                test: /\.(woff|woff2|ttf|eot)$/,
                use: "file-loader?name=fonts/[name].[ext]!static",
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    output: {
        filename: "bundle.[contenthash].js",
        path: path.resolve(__dirname, "static"),
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "bundle.[contenthash].css",
        }),
        function () {
            this.plugin("done", function (stats) {
                const hashes = [];
                Array.from(stats.compilation.assetsInfo.keys()).forEach(key => {
                    const [filename, hash, extension] = key.split(".");
                    if (extension) {
                        hashes.push(`${filename}_${extension}: "${hash}"`);
                    }
                });
                fs.writeFileSync(path.join(__dirname, "_data", "webpack.yml"), hashes.join("\n"));
            });
        },
    ],
};
