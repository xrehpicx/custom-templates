const cli = require('./cli');
const chalk = require('chalk');
const path = require('path');
const fse = require('fs-extra');
const os = require('os');
const Configstore = require('configstore');
const config = new Configstore('ct-config')
console.log(cli)
module.exports = async () => {

    console.log('')
    console.log(chalk.bgBlack.cyan('You need to select a folder to read your templates from'))
    const { templateFolder } = await getfolder()
    config.set('template-folder', templateFolder)
    process.exit()
}

const getfolder = async () => {
    console.log(cli)
    const folder = await cli.selectFolder(os.homedir());
    return folder
};

