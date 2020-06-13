const sharp = require("sharp");
const { logSuccess, logError } = require("./utils");
const { isSvgAsset } = require("./svg");

const MASKABLE = "maskable";

/**
 * Generate a PNG file with a specific dimension
 * @param {string} asset path to the input asset
 * @param {string} pathOutput path to the output folder
 * @param {string} name name of the created asset
 * @param {number} width created asset width
 * @param {number | undefined} height created asset height
 * @param {boolean} displaySize display size in the name
 * @return {object} the json item to put on the manifest file
 */
const resize = async (
  asset,
  pathOutput,
  name,
  width,
  height = undefined,
  displaySize = true
) => {
  if (!height) {
    height = width;
  }

  const size = displaySize ? `-${width}x${height}` : "";
  const filename = `${name}${size}.png`;

  const sharped = isSvgAsset(asset) ? sharp(asset).png() : sharp(asset);

  try {
    await sharped
      .resize(width, height, {
        background: "transparent",
        fit: "contain",
      })
      .toFile(`${pathOutput}/${filename}`);
    logSuccess(filename);
  } catch (error) {
    logError(filename, error);
  }

  const icon = {
    src: `./img/icons/${filename}`,
    sizes: `${width}x${height}`,
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
