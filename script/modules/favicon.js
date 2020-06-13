const fs = require("fs");
const toIco = require("to-ico");
const { logSuccess, logError } = require("./utils");

/**
 * Generate the favicon asset
 * @param {string} asset path to the input asset
 * @param {string} pathOutput path to the output folder
 */
const generateFavicon = async (asset, pathOutput) => {
  const filename = "favicon.ico";
  try {
    try {
      const image = fs.readFileSync(asset);
      const result = await toIco([image], {
        sizes: [16, 24, 32, 48, 64],
        resize: true,
      });
      fs.writeFileSync(`${pathOutput}/${filename}`, result);
      logSuccess(filename);
    } catch (error) {
      logError(filename, error);
    }
  } catch (err) {
    logError(filename, err);
  }
};

module.exports = {
  generateFavicon,
};
