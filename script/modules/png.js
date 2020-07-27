const sharp = require("sharp");
const { logSuccess, logError } = require("./utils");
const { isSvgAsset } = require("./svg");

const MASKABLE = "maskable";

/**
 * Generate a PNG file with a specific dimension
 * @param {string} asset path to the input asset
 * @param {string} pathOutput path to the output folder
 * @param {string} name name of the created asset
 * @param {number} size created asset size
 * @param {boolean} displaySize display size in the name
 * @return {object} the json item to put on the manifest file
 */
const resize = async (asset, pathOutput, name, size, displaySize = true) => {
  const sizeSuffix = displaySize ? `-${size}x${size}` : "";
  const filename = `${name}${sizeSuffix}.png`;

  let sharped = sharp(asset, { density: 300 }).resize(size, size, {
    background: "transparent",
    fit: "contain",
  });

  if (isSvgAsset(asset)) {
    sharped = sharped.png();
  }

  try {
    await sharped.toFile(`${pathOutput}/${filename}`);
    logSuccess(filename);
  } catch (error) {
    logError(filename, error);
  }

  const icon = {
    src: `./img/icons/${filename}`,
    sizes: `${size}x${size}`,
    type: "image/png",
  };

  if (name.includes(MASKABLE)) {
    icon.purpose = MASKABLE;
  }

  return icon;
};

module.exports = {
  resize,
};
