const fs = require("fs");
const toIco = require("to-ico");
const { logSuccess, logError } = require("./utils");

/**
 * Generate the favicon asset
 * @param {string} asset path to the input asset
 * @param {string} pathOutput path to the output folder
 */
const generateFavicon = (asset, pathOutput) => {
  const filename = "favicon.ico";
  try {
    const image = fs.readFileSync(asset);

    toIco([image], {
      sizes: [16, 24, 32, 48, 64],
      resize: true,
    })
      .then((result) => {
        fs.writeFileSync(`${pathOutput}/${filename}`, result);
        logSuccess(filename);
      })
      .catch((err) => {
        logError(filename, err);
      });
  } catch (err) {
    logError(filename, err);
  }
};

module.exports = {
  generateFavicon,
};
