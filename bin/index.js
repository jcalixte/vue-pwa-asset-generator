#!/usr/bin/env node
const yargs = require("yargs");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");

const options = yargs
  .usage("Usage: -a <asset> -o <output>")
  .option("a", {
    alias: "asset",
    describe: "A PNG file",
    type: "string",
    demandOption: true
  })
  .option("o", { alias: "output", describe: "folder output", type: "string" })
  .argv;

const information = `Generating images for ${options.asset}!`;
console.log(information);

const icons = [];

const outputFolder = path.normalize(options.output || "");
const absoluteOutput = path.resolve(outputFolder);

if (!fs.existsSync(absoluteOutput)) {
  fs.mkdirSync(absoluteOutput, {
    recursive: true
  });
}

const resize = (name, width, height = undefined, displaySize = true) => {
  if (!height) {
    height = width;
  }

  const size = displaySize ? `-${width}x${height}` : "";

  sharp(options.asset)
    .resize(width, height, {
      background: "transparent",
      fit: "contain"
    })
    .toFile(`${absoluteOutput}/${name}${size}.png`, function(err) {
      if (err) {
        console.error(err);
      }
    });
  icons.push({
    src: `./img/icons/${name}${size}.png`,
    sizes: `${width}x${height}`,
    type: "image/png"
  });
};

resize("android-chrome", 192);
resize("android-chrome", 512);
resize("apple-touch-icon", 60);
resize("apple-touch-icon", 76);
resize("apple-touch-icon", 120);
resize("apple-touch-icon", 152);
resize("apple-touch-icon", 180);
resize("apple-touch-icon", 180, 180, false);
resize("favicon", 16);
resize("favicon", 32);
resize("msapplication-icon", 144);
resize("mstile", 150);

const json = JSON.stringify({ icons }, null, 2);

fs.writeFile(`./${outputFolder}/manifest.json`, json, function(err) {
  if (err) {
    return console.error(err);
  }
  console.log("Manifest file is created!");
});
