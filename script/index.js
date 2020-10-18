#!/usr/bin/env node
const yargs = require("yargs");
const path = require("path");
const fs = require("fs");
const {
  createOutputFolder,
  logInfo,
  logSuccess,
  logFatal,
  logError,
} = require("./modules/utils");
const { resize } = require("./modules/png");
const { generateFavicon } = require("./modules/favicon");
const { generateSvg } = require("./modules/svg");

const main = () => {
  const options = yargs
    .usage("Usage: -a <asset> -o <output>")
    .option("a", {
      alias: "asset",
      describe: "A PNG or SVG file",
      type: "string",
      demandOption: true,
    })
    .option("o", { alias: "output", describe: "folder output", type: "string" })
    .option("manifest", {
      describe: "generate manifest.json file",
      type: "boolean",
      default: true,
    }).argv;

  const withManifest = options.manifest;

  if (!fs.existsSync(options.asset)) {
    logFatal(
      `${options.asset} — File not found, please verify the asset file name and try again.`
    );
    return;
  }

  const information = `Generating images for ${options.asset}...`;
  logInfo(information);

  const outputPath = createOutputFolder(path.normalize(options.output || ""));
  let assetPath = path.resolve(options.asset);

  generateSvg(assetPath, outputPath);

  const iconParams = [
    ["android-chrome", 192],
    ["android-chrome", 512],
    ["android-chrome-maskable", 192],
    ["android-chrome-maskable", 512],
    ["apple-touch-icon", 60],
    ["apple-touch-icon", 76],
    ["apple-touch-icon", 120],
    ["apple-touch-icon", 152],
    ["apple-touch-icon", 180],
    ["apple-touch-icon", 180, false],
    ["favicon", 16],
    ["favicon", 32],
    ["msapplication-icon", 144],
    ["mstile", 150],
  ];

  const generateIcons = async () => {
    const icons = await Promise.all(
      iconParams.map((iconParam) => resize(assetPath, outputPath, ...iconParam))
    );
    const asset512x512Path = `${outputPath}/android-chrome-512x512.png`;
    await generateFavicon(asset512x512Path, outputPath);

    const json = JSON.stringify({ icons }, null, 2);
    const manifestFilename = "manifest.json";

    if (withManifest) {
      fs.writeFile(`${outputPath}/manifest.json`, json, function (err) {
        if (err) {
          logError(manifestFilename, err);
        } else {
          logSuccess(manifestFilename);
        }
      });
    }
  };

  generateIcons();
};

main();
