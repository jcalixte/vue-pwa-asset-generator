const sharp = require("sharp");
const { logSuccess, logError } = require("./utils");

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
const resize = (
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

  sharp(asset)
    .resize(width, height, {
      background: "transparent",
      fit: "contain",
    })
    .toFile(`${pathOutput}/${filename}`, function (err) {
      if (err) {
        logError(filename, err);
      } else {
        logSuccess(filename);
      }
    });

  const icon = {
    src: `./img/icons/${filename}`,
    sizes: `${width}x${height}`,
    type: "image/png",
  };

  if (name.includes("maskable")) {
    icon.purpose = "maskable";
  }

  return icon;
};

module.exports = {
  resize,
};
