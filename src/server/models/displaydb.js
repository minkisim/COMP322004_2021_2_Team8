module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        'displaydb', 
        {

            dailydb: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
            weeklydb: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
            monthlydb: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
            yearlydb: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
        },
        {
            charset: 'utf8',
            collate: 'utf8_general_ci',
            timestamps: false,
        }
    )
};