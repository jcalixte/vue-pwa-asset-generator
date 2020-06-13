#!/usr/bin/env node
const yargs = require("yargs");
const path = require("path");
const fs = require("fs");
const {
  createOutputFolder,
  logInfo,
  logSuccess,
  logError,
} = require("./modules/utils");
const { resize } = require("./modules/png");
const { generateFavicon } = require("./modules/favicon");
const { generateSvg } = require("./modules/svg");

const options = yargs
  .usage("Usage: -a <asset> -o <output>")
  .option("a", {
    alias: "asset",
    describe: "A PNG or SVG file",
    type: "string",
    demandOption: true,
  })
  .option("o", { alias: "output", describe: "folder output", type: "string" })
  .argv;

const information = `Generating images for ${options.asset}...`;
logInfo(information);

const outputPath = createOutputFolder(path.normalize(options.output || ""));
let assetPath = path.resolve(options.asset);

generateSvg(assetPath, outputPath);

const generateIcons = async () => {
  const icons = await Promise.all([
    resize(assetPath, outputPath, "android-chrome", 192),
    resize(assetPath, outputPath, "android-chrome", 512),
    resize(assetPath, outputPath, "android-chrome-maskable", 192),
    resize(assetPath, outputPath, "android-chrome-maskable", 512),
    resize(assetPath, outputPath, "apple-touch-icon", 60),
    resize(assetPath, outputPath, "apple-touch-icon", 76),
    resize(assetPath, outputPath, "apple-touch-icon", 120),
    resize(assetPath, outputPath, "apple-touch-icon", 152),
    resize(assetPath, outputPath, "apple-touch-icon", 180),
    resize(assetPath, outputPath, "apple-touch-icon", 180, 180, false),
    resize(assetPath, outputPath, "favicon", 16),
    resize(assetPath, outputPath, "favicon", 32),
    resize(assetPath, outputPath, "msapplication-icon", 144),
    resize(assetPath, outputPath, "mstile", 150),
  ]);
  const asset512x512Path = `${outputPath}/android-chrome-512x512.png`;
  await generateFavicon(asset512x512Path, outputPath);

  const json = JSON.stringify({ icons }, null, 2);
  const manifestFilename = "manifest.json";

  fs.writeFile(`${outputPath}/manifest.json`, json, function (err) {
    if (err) {
      logError(manifestFilename, err);
    } else {
      logSuccess(manifestFilename);
    }
  });
};

generateIcons();
