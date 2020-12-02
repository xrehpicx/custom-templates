const Configstore = require('configstore');
const config = new Configstore('ct-config')

module.exports = () => config.get('template-folder')