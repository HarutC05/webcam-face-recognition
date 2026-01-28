const webpack = require("webpack");

module.exports = {
    webpack: {
        configure: (webpackConfig) => {
            webpackConfig.resolve = webpackConfig.resolve || {};
            webpackConfig.resolve.fallback = {
                ...(webpackConfig.resolve.fallback || {}),
                crypto: require.resolve("crypto-browserify"),
                stream: require.resolve("stream-browserify"),
                buffer: require.resolve("buffer/"),
                fs: false,
            };

            webpackConfig.plugins = webpackConfig.plugins || [];
            webpackConfig.plugins.push(
                new webpack.ProvidePlugin({
                    Buffer: ["buffer", "Buffer"],
                    process: "process/browser",
                }),
            );

            return webpackConfig;
        },
    },
};
