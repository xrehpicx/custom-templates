const Configstore = require('configstore');
const config = new Configstore('ct-config')

console.log(config.get('template-folder'))
config.clear()
console.log(config.get('template-folder'))