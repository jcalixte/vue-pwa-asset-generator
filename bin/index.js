#!/usr/bin / env node
const yargs = require("yargs");

const options = yargs
  .usage("Usage: -a <asset> -o <folder_output>")
  .option("a", { alias: "asset", describe: "A PNG file", type: "string", demandOption: true })
  .option("o", { alias: "folder", describe: "folder output", type: "string" })
  .argv;

const greeting = `Hello, ${options.name}!`;

console.log(greeting);
