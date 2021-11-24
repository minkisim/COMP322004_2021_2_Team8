'use strict';

const path = require('path');
const Sequelize = require('sequelize');
const env = process.env.NODE_ENV || 'development';
const config = require(path.join(__dirname, '..', 'config', 'db.json'))[ env ];
const db = {};

//db연동
let sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config,
    {
      define: {
        charset: 'utf8',
        collate: 'utf8_general_ci'
      }
    }
  );
  
    db.sequelize = sequelize;
    db.Sequelize = Sequelize;

    db.sequelize
    .authenticate()
    .then(() => {
        console.log('뭔진 몰라도 된거임.');
    })
    .catch(err => {
        console.log('Unable to connect to the database: ', err);
    });

    //테이블 추가하는 영역
    db.User = require('./nodedb')(sequelize, Sequelize);
    db.Imagedb = require('./imagedb')(sequelize, Sequelize);
    db.Displaydb = require('./displaydb')(sequelize, Sequelize);
    db.Auctiondb = require('./auctiondb')(sequelize, Sequelize);
    db.User_dib_db = require('./user_bid')(sequelize,Sequelize);
    db.Artistdb = require('./artistdb')(sequelize,Sequelize);
db.secret = '(9*)5$&!3%^0%^@@2$1!#5@2!4';
module.exports = db;