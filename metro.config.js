const { getDefaultConfig } = require("expo/metro-config");

const config = getDefaultConfig(__dirname);

// 👇 ini penting
config.resolver.assetExts.push("bin");

module.exports = config;
