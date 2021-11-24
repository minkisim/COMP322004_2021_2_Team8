module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        'user', 
        {

            username: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
            name: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
            password: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
            email: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
            phone: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
            role:{
                type: DataTypes.STRING(255),
                allowNull: true
            }
        },
        {
            charset: 'utf8',
            collate: 'utf8_general_ci',
            timestamps: true,
        }
    )
};