const sharp = require("sharp");
const fs = require("fs");
const toIco = require("to-ico");
const { logSuccess, logError } = require("./utils");

/**
 * Generate the favicon asset
 * @param {string} assetPath path to the png input asset
 * @param {string} pathOutput path to the output folder
 * @param {string} background define a fallback background
 */
const generateFavicon = async (assetPath, pathOutput, background) => {
  const filename = "favicon.ico";
  const assetInputFilename = "favicon.png";
  let inputPath = assetPath;

  if (background) {
    inputPath = `${pathOutput}/${assetInputFilename}`;
    const assetInput = sharp(assetPath).flatten({
      background,
    });

    await assetInput.toFile(inputPath);
  }

  try {
    const image = fs.readFileSync(inputPath);
    const result = await toIco([image], {
      sizes: [16, 24, 32, 48, 64],
      resize: true,
    });
    fs.writeFileSync(`${pathOutput}/${filename}`, result);
    fs.unlinkSync(inputPath);
    logSuccess(filename);
  } catch (err) {
    logError(filename, err);
  }
};

module.exports = {
  generateFavicon,
};
