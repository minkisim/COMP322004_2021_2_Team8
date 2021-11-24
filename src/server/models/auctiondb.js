module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        'auctiondb', 
        {

            artist: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
            artname:{
                type: DataTypes.STRING(255),
                allowNull: true
            },

            //작가 년도, 경력
            artist_period: {
                type: DataTypes.STRING(255),
                allowNull: true
            },

            //경매 시작일
            begin_point: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
            //경매 종료일
            end_point: {
                type: DataTypes.STRING(255),
                allowNull: true
            },

            //시작가
            beginprice: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
            //경매 최종가격
            accepted_price: {
                type: DataTypes.STRING(255),
                allowNull: true
            },

           
            //경매 단위
            auction_unit:{
                type: DataTypes.STRING(255),
                allowNull: true
            },

            //작품 id
            artwork_id:{
                type: DataTypes.INTEGER,
                allowNull: true
            },

            //경매 소유주 id
            owner_id: {
                type: DataTypes.INTEGER,
                allowNull: true
            },

            first_user:{
                type: DataTypes.STRING(255),
                allowNull: true
            },
            second_user:{
                type: DataTypes.STRING(255),
                allowNull: true
            },
            third_user:{
                type: DataTypes.STRING(255),
                allowNull: true
            },


            first_price:{
                type: DataTypes.STRING(255),
                allowNull: true
            },
            second_price:{
                type: DataTypes.STRING(255),
                allowNull: true
            },
            third_price:{
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