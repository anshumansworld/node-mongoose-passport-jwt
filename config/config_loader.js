let config = require('./config.json');
const fs = require('fs');
const _ = require('lodash');
const path = require('path');
if (fs.existsSync(path.join(__dirname, 'local.config.js'))){
    const localConfig = require('./local.config.js');
    config = _.merge(config, localConfig);
}

module.exports = config;
