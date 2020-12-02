#!/usr/bin/env node
const chalk = require('chalk');
const clear = require('clear');
const figlet = require('figlet');

const cli = require('./lib/cli');

const setup = require('./lib/setup');
const customTemplateFolder = require('./lib/getTemplateFolder')()

clear()
console.log(
    chalk.cyan(
        'creating custom templates'
    )
);

!customTemplateFolder ? setup() : cli.start()