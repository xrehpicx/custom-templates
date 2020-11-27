const inquirer = require('./inquirer');
const chalk = require('chalk');
const path = require('path');
const os = require('os');
const Configstore = require('configstore');
const config = new Configstore('ct-config')

module.exports = async () => {
    console.log('')
    console.log(chalk.bgBlack.cyan('You need to select a folder to read your templates from'))
    const { templateFolder } = await getfolder()
    config.set('template-folder', templateFolder)
    process.exit()
}

const getfolder = async () => {
    const folder = await inquirer.selectFolder(os.homedir());
    return folder
};

