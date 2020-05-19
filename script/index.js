#!/usr/bin/env node
const yargs = require("yargs");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const toIco = require("to-ico");
const chalk = require("chalk");
const potrace = require("potrace");

const options = yargs
  .usage("Usage: -a <asset> -o <output>")
  .option("a", {
    alias: "asset",
    describe: "A PNG file",
    type: "string",
    demandOption: true,
  })
  .option("o", { alias: "output", describe: "folder output", type: "string" })
  .argv;

const information = `Generating images for ${options.asset}...`;
console.log(chalk.blue(information));

const icons = [];

const outputFolder = path.normalize(options.output || "");
const absoluteOutput = path.resolve(outputFolder);

if (!fs.existsSync(absoluteOutput)) {
  fs.mkdirSync(absoluteOutput, {
    recursive: true,
  });
}

const logSuccess = (filename) => {
  console.log(chalk.green(`${filename} created!`));
};

const logError = (filename, err) => {
  console.error(chalk.red(`error generating ${filename}`, err));
};

const resize = (name, width, height = undefined, displaySize = true) => {
  if (!height) {
    height = width;
  }

  const size = displaySize ? `-${width}x${height}` : "";
  const filename = `${name}${size}.png`;

  sharp(options.asset)
    .resize(width, height, {
      background: "transparent",
      fit: "contain",
    })
    .toFile(`${absoluteOutput}/${filename}`, function (err) {
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

  icons.push(icon);
};

const generateFavicon = () => {
  try {
    const image = fs.readFileSync(options.asset);
    const filename = "favicon.ico";

    toIco([image], {
      sizes: [16, 24, 32, 48, 64],
      resize: true,
    })
      .then((result) => {
        fs.writeFileSync(`${absoluteOutput}/${filename}`, result);
        logSuccess(filename);
      })
      .catch((err) => {
        logError(filename, err);
      });
  } catch (err) {
    logError(filename, err);
  }
};

const generateSvg = () => {
  const filename = "safari-pinned-tab.svg";
  potrace.trace(options.asset, (err, svg) => {
    if (err) {
      console.error(chalk.red("error generating svg icon", err));
      return;
    }
    fs.writeFileSync(`${absoluteOutput}/${filename}`, svg);
    logSuccess(filename);
  });
};

generateSvg();
generateFavicon();
resize("android-chrome", 192);
resize("android-chrome", 512);
resize("android-chrome-maskable", 192);
resize("android-chrome-maskable", 512);
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

fs.writeFile(`${outputFolder}/manifest.json`, json, function (err) {
  const filename = "manifest.json";
  if (err) {
    logError(filename, err);
  } else {
    logSuccess(filename);
  }
});
