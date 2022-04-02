const fs = require("fs");
const path = require("path");
const chalk = require("chalk");

const colorRegex = /^#([0-9a-f]{3}){1,2}$/i;

/**
 * parse a string to a correct color if it is possible
 * @param {string} input color
 * @returns a correct color if the input is valid
 */
const getColorFromString = (input) => {
  if (!input) {
    return null;
  }

  if (input[0] !== "#") {
    input = `#${input}`;
  }

  const isColor = colorRegex.test(input);

  return isColor ? input : null;
};

/**
 * Log a information.
 * @param {string} filename file name
 */
const logInfo = (filename) => {
  console.log(chalk.blue(`${filename} created!`));
};

/**
 * Log a successful message.
 * @param {string} filename file name
 */
const logSuccess = (filename) => {
  console.log(chalk.green(`${filename} created!`));
};

/**
 * Log an error message.
 * @param {string} filename file name
 * @param {string} err error thrown
 */
const logError = (filename, err) => {
  console.error(chalk.red(`error generating ${filename}`, err));
};

/**
 * Log a fatal error message.
 * @param {string} err error thrown
 */
const logFatal = (err) => {
  console.error(chalk.red(err));
};

/**
 * Create the output folder event if it is a nested folder
 * @param {string} outputFolder path to the output folder
 * @returns {string} absolute path to the output folder
 */
const createOutputFolder = (outputFolder) => {
  const absolutePath = path.resolve(outputFolder);

  if (!fs.existsSync(absolutePath)) {
    fs.mkdirSync(absolutePath, {
      recursive: true,
    });
  }

  return absolutePath;
};

module.exports = {
  getColorFromString,
  logInfo,
  logSuccess,
  logError,
  logFatal,
  createOutputFolder,
};
