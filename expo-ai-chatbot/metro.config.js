const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

config.resolver = {
  ...config.resolver,
  //   unstable_enablePackageExports: true,
  // iOS-only platform resolution
  platforms: ['ios', 'native'],
  resolverMainFields: ['react-native', 'main'],
};

module.exports = withNativeWind(config, { input: "./src/global.css" });
