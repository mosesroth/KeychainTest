// Simple config plugin for react-native-keychain
const { withProjectBuildGradle } = require('@expo/config-plugins');

module.exports = function withReactNativeKeychain(config) {
  return withProjectBuildGradle(config, async (config) => {
    // No modifications needed for this simple integration
    return config;
  });
};
