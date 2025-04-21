const { DataTypes } = require('sequelize');
module.exports = (sequelize) => {
    const File = sequelize.define('File', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        filename: {
            type: DataTypes.TEXT,
            allowNull: false,
        },
        img: {
            type: DataTypes.TEXT,  
            allowNull: false,
        },
        uploaded_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: sequelize.fn('NOW'),
        },
        modified_at: {
            type: DataTypes.DATE,
            allowNull: true,
        }
    }, {
        tableName: 'files',
        timestamps: false,
    });
    return File;
};



















