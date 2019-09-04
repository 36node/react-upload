module.exports = async ({ config }) => {
  config.module.rules.push({
    test: /\.less$/,
    use: [
      { loader: "style-loader" },
      { loader: "css-loader" },
      {
        loader: "less-loader",
        options: {
          javascriptEnabled: true,
        },
      },
    ],
  });

  return config;
};
