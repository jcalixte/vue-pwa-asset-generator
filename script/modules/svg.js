const fs = require("fs");
const potrace = require("potrace");
const { logSuccess, logError } = require("./utils");

/**
 * check if a file is an svg.
 * @param {string} asset path to the input asset
 * @returns {boolean} determines if the input asset is svg file or not
 */
const isSvgAsset = (asset = "") => {
  const assetExtension = asset.split(".").pop().toLowerCase();
  return assetExtension === "svg";
};

/**
 * Generate an SVG from
 * @param {string} asset path to the input asset
 * @param {string} pathOutput path to the output folder
 */
const generateSvg = (asset, pathOutput) => {
  const filename = "safari-pinned-tab.svg";
  const path = `${pathOutput}/${filename}`;
  if (isSvgAsset(asset)) {
    fs.copyFileSync(asset, path);
  } else {
    potrace.trace(asset, (err, svg) => {
      if (err) {
        logError(filename, err);
        return;
      }
      fs.writeFileSync(path, svg);
      logSuccess(filename);
    });
  }
};

module.exports = {
  isSvgAsset,
  generateSvg,
};
