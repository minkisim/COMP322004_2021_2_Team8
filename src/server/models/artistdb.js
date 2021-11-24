module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        'artistdb', 
        {
            
            artist:{
                type: DataTypes.STRING(255),
                allowNull: true
            },
            filename:{
                type: DataTypes.STRING(255),
                allowNull : true
            },
            
            artist_info:{
                type: DataTypes.STRING(255),
                allowNull: true
            },
            life_term:{
                type: DataTypes.STRING(255),
                allowNull: true
            },
            artistyearInfo:{
                type: DataTypes.STRING(255),
                allowNull: true
            }


        },
        {
            charset: 'utf8',
            collate: 'utf8_general_ci',
            timestamps: false,
        }
    )
};