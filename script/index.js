#!/usr/bin/env node
const yargs = require("yargs");
const path = require("path");
const fs = require("fs");
const chalk = require("chalk");
const { createOutputFolder, logSuccess } = require("./modules/utils");
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
console.log(chalk.blue(information));

const icons = [];

const outputPath = createOutputFolder(path.normalize(options.output || ""));
const assetPath = path.resolve(options.asset);

generateSvg(assetPath, outputPath);
generateFavicon(assetPath, outputPath);
icons.push(
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
  resize(assetPath, outputPath, "mstile", 150)
);

const json = JSON.stringify({ icons }, null, 2);

fs.writeFile(`${outputPath}/manifest.json`, json, function (err) {
  const filename = "manifest.json";
  if (err) {
    logError(filename, err);
  } else {
    logSuccess(filename);
  }
});
