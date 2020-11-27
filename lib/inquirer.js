const inquirer = require('inquirer');
inquirer.registerPrompt('directory', require('inquirer-select-directory'));
module.exports = {
    selectFolder: (basePath) => {
        return inquirer.prompt([{
            type: 'directory',
            name: 'templateFolder',
            message: 'Select your template directory',
            basePath
        }])
    }, selectTemplate: (choices) => {
        return inquirer.prompt([{
            type: 'list',
            name: 'template',
            choices
        }])
    },
    askGithubCredentials: () => {
        const questions = [
            {
                name: 'username',
                type: 'input',
                message: 'Enter your GitHub username or e-mail address:',
                validate: function (value) {
                    if (value.length) {
                        return true;
                    } else {
                        return 'Please enter your username or e-mail address.';
                    }
                }
            },
            {
                name: 'password',
                type: 'password',
                message: 'Enter your password:',
                validate: function (value) {
                    if (value.length) {
                        return true;
                    } else {
                        return 'Please enter your password.';
                    }
                }
            }
        ];
        return inquirer.prompt(questions);
    },
};