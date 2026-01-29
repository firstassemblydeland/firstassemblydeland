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
                type: 'asset/resource',
                generator: {
                    filename: 'assets/[name].[contenthash][ext]'
                },
                use: [
                    {
                        loader: 'image-webpack-loader',
                        options: {
                            bypassOnDebug: true,
                            mozjpeg: {
                                progressive: true,
                                quality: 65,
                            },
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
                type: 'asset/resource',
                generator: {
                    filename: 'fonts/[name].[contenthash][ext]'
                }
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
        {
            apply: (compiler) => {
                compiler.hooks.done.tap('WriteWebpackHashes', (stats) => {
                    const entries = new Map();

                    Array.from(stats.compilation.assetsInfo.keys()).forEach((assetPath) => {
                        const parsed = path.parse(assetPath);
                        const hashMatch = parsed.name.match(/^(.*)\.([0-9a-f]+)$/i);

                        if (!hashMatch) {
                            return;
                        }

                        const baseName = hashMatch[1];
                        const hash = hashMatch[2];
                        const extension = parsed.ext.replace('.', '');

                        if (!extension) {
                            return;
                        }

                        const dirPrefix = parsed.dir ? `${parsed.dir}/` : '';
                        const key = `${dirPrefix}${baseName}_${extension}`;
                        entries.set(key, hash);
                    });

                    const lines = Array.from(entries.entries())
                        .sort(([a], [b]) => a.localeCompare(b))
                        .map(([key, hash]) => `${key}: "${hash}"`);

                    fs.writeFileSync(
                        path.join(__dirname, "_data", "webpack.yml"),
                        `${lines.join("\n")}\n`
                    );
                });
            }
        },
    ],
};
