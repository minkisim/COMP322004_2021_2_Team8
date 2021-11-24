module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        'user_bid_db',
        {
            
            //응찰 db  경매에서 상위 3명
            auction_time:{
                type: DataTypes.STRING(255),
                allowNull: true
            },
            //작품 id
            artwork_id:{
                type: DataTypes.STRING(255),
                allowNull: true
            },
            userid:{
                type: DataTypes.STRING(255),
                allowNull: true
            },
            username:{
                type: DataTypes.STRING(255),
                allowNull: true
            },


            userprice:{
                type: DataTypes.STRING(255),
                allowNull: true
            },

            //금액 단위
            auctionunit:{
                type: DataTypes.STRING(255),
                allowNull: true
            },
            //등록한 시각
            updateDate:{
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