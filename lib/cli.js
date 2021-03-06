const inquirer = require('inquirer');
const chalk = require('chalk');
const fse = require('fs-extra');
const CLI = require('clui');
var cp = require('child_process');
const os = require('os');
const Spinner = CLI.Spinner;
const path = require('path');
const customTemplateFolder = require('./getTemplateFolder')()

inquirer.registerPrompt('directory', require('inquirer-select-directory'));
const cli = {
    start: () => {
        var args = require('yargs/yargs')(process.argv.slice(2))
            .usage('Usage: $0 <command> [options]')
            .example('$0 -t react-typescript', 'creates the template react-typescript')
            .alias('t', 'template')
            .nargs('t', 1)
            .describe('-t', 'Load a template')

            .help('h')
            .alias('h', 'help')
            .argv;

        const template = args.template || args.t
        let folderPath = args._[0] ? path.resolve(args._[0]) : process.cwd();

        if (template) { createTemplate(template, folderPath) }
        else {
            cli.selectTemplate(folderPath)
        }

    },
    selectFolder: (basePath) => {
        return inquirer.prompt([{
            type: 'directory',
            name: 'templateFolder',
            message: 'Select your template directory',
            basePath
        }])
    }, selectTemplatePrompt: (choices) => {

        return inquirer.prompt([{
            type: 'list',
            name: 'template',
            choices
        }])
    },
    selectTemplate: async function (folderPath) {


        if (process.cwd() === folderPath) {
            console.log(chalk.black.bgCyan('Using current folder as project folder by default'))
        }
        console.log(chalk.cyan.bold(path.parse(folderPath).name))
        console.log(chalk.gray(`located at: ${folderPath}`))

        const temps = await fse.readdir(customTemplateFolder)
        const { template } = await cli.selectTemplatePrompt(temps.filter((name) => !name.startsWith('.')))

        createTemplate(template, folderPath)
    }
};

function createTemplate(template, folderPath) {

    const status = new Spinner(`Copying files from ${template} to ${folderPath}, please wait...`);
    status.start()

    fse.copy(path.join(customTemplateFolder, template), folderPath, {
        overwrite: true,
        filter: (file) => {
            if (path.parse(file).name === 'node_modules') { return false }
            return true
        },
        recursive: true,

    }, function (err) {
        if (err) {
            status.stop();
            console.error(err);
        } else {
            status.stop();
            console.log(`template '${template}' created in ${folderPath}`)
            installdeps(folderPath, template)
        }
    });
}


async function installdeps(folderPath, template) {


    var modPath = folderPath;

    // ensure path has package.json
    if (!fse.existsSync(path.join(modPath, 'package.json'))) {
        return;
    }

    // const packagejson = await fse.readJSON(path.join(customTemplateFolder, template, 'package.json'))

    // npm binary based on OS
    var npmCmd = os.platform().startsWith('win') ? 'npm.cmd' : 'npm';
    console.log('installing dependencies...')
    // install folder
    cp.spawn(npmCmd, ['i'], {
        env: process.env,
        cwd: modPath,
        stdio: 'inherit'
    });
}

module.exports = cli