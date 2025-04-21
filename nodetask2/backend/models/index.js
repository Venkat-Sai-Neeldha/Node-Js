const { Sequelize } = require('sequelize');
const config = require('../config/config');

const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    {
        host: config.host,
        dialect: config.dialect,
        logging: false,
    }
);

const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

// Initialize models
db.File = require('./file.model.js')(sequelize);

module.exports = db;