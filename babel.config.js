module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ["module:react-native-dotenv", {
        "modulenName":"@env",
        "path":".env",
        "blacklist":null,
        "whitelist":null,
        "safe":false,
        "allowUndefined":true
      }]
    ]
  };
};
