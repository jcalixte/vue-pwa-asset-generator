#!/usr/bin/env node
const yargs = require("yargs");
const sharp = require("sharp");
const path = require("path");
const fs = require("fs");
const toIco = require("to-ico");
const chalk = require("chalk");

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

const information = `Generating images for ${options.asset}...`;
console.log(chalk.blue(information));

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
  const filename = `${name}${size}.png`;

  sharp(options.asset)
    .resize(width, height, {
      background: "transparent",
      fit: "contain"
    })
    .toFile(`${absoluteOutput}/${filename}`, function(err) {
      if (err) {
        console.error(chalk.red(err));
      } else {
        console.log(chalk.green(`${filename} created!`));
      }
    });
  icons.push({
    src: `./img/icons/${filename}`,
    sizes: `${width}x${height}`,
    type: "image/png"
  });
};

generateFavicon = () => {
  try {
    const image = fs.readFileSync(options.asset);

    toIco([image], {
      sizes: [16, 24, 32, 48, 64],
      resize: true
    }).then(result => {
      fs.writeFileSync(`${absoluteOutput}/favicon.ico`, result);
    });
  } catch (error) {
    console.error(chalk.red(error));
  }
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
generateFavicon();

const json = JSON.stringify({ icons }, null, 2);

fs.writeFile(`${outputFolder}/manifest.json`, json, function(err) {
  if (err) {
    return console.error(chalk.red("error generating manifest.json", err));
  }
  console.log(chalk.underline(chalk.green("Manifest file is created!")));
});
