const inquirer = require('inquirer');
const chalk = require('chalk');
const fse = require('fs-extra');
const CLI = require('clui');
const os = require('os');
const Spinner = CLI.Spinner;
const path = require('path');
const Configstore = require('configstore');
const { run } = require("./run");
const config = new Configstore('ct-config')
const customTemplateFolder = require('./getTemplateFolder')()

inquirer.registerPrompt('directory', require('inquirer-select-directory'));

const cli = {
    start: async () => {
        var args = require('yargs/yargs')(process.argv.slice(2))
            .usage('Usage: $0 <command> [options]')
            .example('$0 -t react-typescript', 'creates the template react-typescript')
            .alias('t', 'template')
            .nargs('t', 1)
            .describe('-t', 'Load a template')
            .describe('--set', 'set new template folder')
            .help('h')
            .alias('h', 'help')
            .argv;

        if (typeof args.set === 'boolean') {
            console.log('')
            console.log(chalk.bgBlack.cyan('You need to select a folder to read your templates from'))
            const { templateFolder } = await cli.selectFolder(os.homedir())
            config.set('template-folder', templateFolder)
            console.log(chalk.bgBlack.cyan('Your template folder is set to:' + templateFolder))
            process.exit();
        } else if (typeof args.set === 'string') {

            if (args.set && fse.existsSync(path.resolve(args.set))) {
                console.log('');
                console.log(chalk.bgBlack.cyan('Your template folder is set to' + path.resolve(args.set)))
                config.set('template-folder', path.resolve(args.set));
                process.exit();
            }
        } else {

            const template = args.template || args.t
            let folderPath = args._[0] ? path.resolve(args._[0]) : process.cwd();

            if (template) { createTemplate(template, folderPath) }
            else {
                cli.selectTemplate(folderPath)
            }
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

    try {
        const pkgObj = await fse.readJson(path.join(modPath, 'package.json'));
        pkgObj.name = path.parse(folderPath).name;
        await fse.writeJson(path.join(modPath, 'package.json'), pkgObj, { spaces: 2 });
    } catch (error) {
        console.error(error)
    }

    // npm binary based on OS
    var npmCmd = os.platform().startsWith('win') ? 'npm.cmd' : 'npm';
    console.log(chalk.cyanBright('installing dependencies'))
    // install folder
    await run(npmCmd, ['i'], {
        env: process.env,
        cwd: modPath,
    })



    console.log(chalk.cyanBright('installed dependencies'))
}

module.exports = cli