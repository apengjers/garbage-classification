const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// DONT DELETE THIS LINE, IT IS NEEDED TO LOAD THE BIN FILES
config.resolver.assetExts.push("bin");

module.exports = config;
