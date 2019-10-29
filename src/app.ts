#!/usr/bin/env node

const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');
const path = require('path');
const program = require('commander');

clear();
console.log(
  chalk.red(
    figlet.textSync('git-2-neo4j', { horizontalLayout: 'full' })
  )
);


program
  .version('0.0.1')
  .description("Copiar git log en la base de datos neo4j")
  .option('-r, --repo<reponame>', 'Repositorio')
  .parse(process.argv);
