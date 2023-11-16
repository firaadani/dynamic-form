const path = require("path");

module.exports = {
  entry: "./app/page.js", // Specify the entry point of your application
  output: {
    filename: "bundle.js", // Specify the name of the bundled file
    path: path.resolve(__dirname, "dist"), // Specify the output directory
  },
  module: {
    rules: [
      // Define rules for how different file types should be processed
      {
        test: /\.js$/, // Apply this rule to files ending in .js
        exclude: /node_modules/, // Exclude the node_modules folder
        use: {
          loader: "babel-loader", // Use Babel to transpile JavaScript files
        },
      },
      // Add more rules as needed for other file types (e.g., CSS, images)
    ],
  },
};
