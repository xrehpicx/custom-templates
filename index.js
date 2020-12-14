#!/usr/bin/env node
const chalk = require('chalk');
const clear = require('clear');

const cli = require('./lib/cli');
const setup = require('./lib/setup');
const customTemplateFolder = require('./lib/getTemplateFolder')()

clear()
console.log(
    chalk.cyan(
        'creating custom templates'
    )
);

customTemplateFolder ? cli.start() : setup();