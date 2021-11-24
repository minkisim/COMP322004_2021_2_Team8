module.exports = (sequelize, DataTypes) => {
    return sequelize.define(
        'imagedb', 
        {
            artist:{
                type: DataTypes.STRING(255),
                allowNull: true
            },

            artname: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
            exhibition: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
            //작품 등록날짜
            artrelease_date: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
            imagesize: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
            imageurl: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
            imagetype: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
            //작품설명
            arttext:{
                type: DataTypes.STRING(1000),
                allowNull: true
            },

            

            //상한 하한가
            KRW_upper: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
            KRW_lower: {
                type: DataTypes.STRING(255),
                allowNull: true
            },

            USD_upper: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
            USD_lower: {
                type: DataTypes.STRING(255),
                allowNull: true
            },

            

            //경매시간이 완료되었는지
            expired:{
                type: DataTypes.STRING(255),
                allowNull: true
            },

            //경매에 올라왔는지 여부
            isauctioned:{
                type: DataTypes.STRING(255),
                allowNull: true
            },
            
            autiondbindex:
            {
                type: DataTypes.STRING(255),
                allowNull: true
            },

            displaydbindex: {
                type: DataTypes.STRING(255),
                allowNull: true
            },


            //전시일정
            displaydate: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
            //전시관람체류시간
            remaintime: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
            //관람수
            audiencenum:
            {
                type: DataTypes.STRING(255),
                allowNull: true
            },

            //현재 소유자
            owner:
            {
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