const express = require('express');
const app = express();
const db = require('./config/db');
const cors = require("cors");
const corsOptions = {
    origin : "http://localhost:3000",
    credentials : true,
}

const fs = require('fs');

const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRound = 16;
const tokenKey = 'veryveryveryImportantToKeepIt';

const multer = require('multer');

const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");

const sequelize = require('./models').sequelize;
sequelize.sync();

const {
    User,
    Imagedb,
    Sequelize: { Op }
  } = require('./models');
sequelize.query('SET NAMES utf8;');

const PORT = process.env.PORT || 4000;

app.use(express.json());

app.use(cors(corsOptions));

app.get('/', (req, res) => {
    res.send({test:'Server Response Sucess'});
});




app.use('/file', express.static('./public')); 
app.use('/text', express.static('./public/text')); 
app.use('/img', express.static('./public/img')); 
app.use('/pdf', express.static('./public/pdf')); 


app.use(cookieParser());

var _storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if(file.mimetype=='image/png' || file.mimetype=='image/jpeg')
            cb(null, 'public/img/') // cb 콜백함수를 통해 전송된 파일 저장 디렉토리 설정

        else if(file.mimetype=='application/pdf')
            cb(null, 'public/pdf/')


        else
            cb(null,'public/text/')
    }//,

  //  filename: function (req, file, cb) {
   //   cb(null, file.originalname) // cb 콜백함수를 통해 전송된 파일 이름 설정
   // }
  });

//const upload2 = multer({dest: 'upload/'})
const upload = multer({ storage: _storage });//이렇게하지않으면 filename이 undefined가 나오게됨.

app.post('/fileupload', upload.single('file'), function(req, res){
    res.send('Uploaded! : '+req.file); // object를 리턴함
    console.log(req.file); // 콘솔(터미널)을 통해서 req.file Object 내용 확인 가능.
    if(req.file.mimetype=='image/png' || req.file.mimetype=='image/jpeg')
    {
        Imagedb.create({
          filename: req.file.originalname,
          filesize: req.file.size,
          filetype: req.file.mimetype,
          owner: '홍길동'
        })
    }
  });


app.get('/img',(req,res)=>{
    console.log(__dirname+' 안됨? '+req.query.var1)
    //res.sendFile(__dirname+`/../upload/img/sign (2).png`);
    
    
    fs.readFile(__dirname+`/../public/img/`+req.query.var1,(err,data)=>{
        if(err){
            res.writeHead(500, {'Content-Type':'text/html'});
            res.end('500 Internal Server '+err);
            console.log('성공');
          }else{
            // 6. Content-Type 에 4번에서 추출한 mime type 을 입력
            res.writeHead(200, {'Content-Type':'image/png'});
            res.end(data);
            console.log('실패');
          }

        //res.writeHead(200, {'Content-Type': 'text/html'});
       // res.write('<h1>파일 업로드 성공</h1>');
        //res.end(data);
    })

})


app.post('/api/joinForm',(req,res)=>
{
    console.log('회원가입');

    User.findOne({
        where : {username : req.body.username}
    })
    .then((find_db)=>{

        
        if(find_db != null)
        {
            console.log('해당 아이디는 사용중입니다')
            return res.status(200).json({
                success:false
            });
        }

        else{
      
                   
                    User.create({
                        username: req.body.username,
                        name: req.body.name,
                        password: req.body.password,
                        email: req.body.email,
                        phone: req.body.phone,
                    })
                    .then(() => {
                        console.log("회원가입 성공")
                        return res.status(200).json({
                            success:true
                        })
                    })
                    .catch(() => {
                        return res.status(200).json({
                            success:false
                        })
                    })
            
        }
    })

    .catch(()=>{
        return res.status(200).json({
            success:false
        })
    })
    

})

app.post('/api/loginForm',(req,res)=>
{
    console.log('로그인');

    User.findOne({
        where : {username : req.body.username}
    })
    .then((result) => {
        
            if(result.password != req.body.password)
            {
                console.log("비밀번호 불일치 : "+err);
                return res.json({
                    success:false
                })
            }
            
            //로그인 완료
            else
            {
                console.log('비밀번호 일치');


               jwt.sign({
                    userid:result.id
                }, tokenKey,
                {
                    expiresIn:'30m'//유효시간
                }, (err, accessToken) => {

                    console.log('로그인 완료')
                    //쿠키생성

                    

                    return res.cookie("user",accessToken, {
                        //httpOnly: true,//개발은 localhost환경에서 진행되므로 생략
                        maxAge: 5*60*1000
                    })
                    .status(200)
                    .json({
                        success: true,
                        accessToken : accessToken
                    })
                });
                

                
            }
       
    })
    .catch(() => {
        console.log("데이터 베이스에 없음");
        return res.status(200).json({
            success:false
        })
    })

})



app.get('/api/products', (req, res) => {
    db.query("SELECT * FROM nodedb.user", (err, data) => {
        if(!err) res.send({ products : data });
        else res.send(err);
    })
})

app.post("/idplz", (req,res)=>{
    console.log(req.body);

    User.create({
         username : req.body.username,
        password : req.body.password,
         email : req.body.email
    })
    .then(result => {
        res.send(result)
    })
    .catch(err => {
        console.log(err)
        throw err;
    })
    
});

app.get('/get/data', (req, res) => {
    User.findAll()
     .then( result => { res.send(result) })
     .catch( err => { throw err })
 }) 

 app.post('/get/keywordData', (req, res) => {
    User.findAll({
        where: { username : req.body.username }
    })
    .then( result => { console.log(result); res.send(result) })
    .catch( err => { throw err })
})

app.post('/modify/data', (req, res) => {
    User.update({ name : req.body.modify.newName }, {
        where : { id : req.body.modify.id }
    })
    .then( result => { res.send(result) })
    .catch( err => { throw err })
})

app.post('/delete/data', (req, res) => {
    User.destroy({
        where : { id : req.body.delete.id }
    })
    .then( res.sendStatus(200) )
    .catch( err => { throw err })
})

//여기서 부터 blog내용 적용

app.get('/api/home1/about', (req, res) =>
{

    console.log('홈1 데이터 주고받기')

    Imagedb.findAll({
        limit : 3
    })
    .then(result => {res.json(result)})
    .catch(err => { throw err })

    /*
    return res.json(
        [{
            per1: 'John.P.Smith',
            per2: 'Robert.F.Proud',
            musium: 'dskgnkaehaKDJBFD'
            
        },
        {
            per1: 'Shit.Why do we have to suffer like this',
            per2: 'Oh ok I dont intend to do that but',
            musium: 'Vane2021'
            
        },
        {
            per1: 'So next',
            per2: 'Will be conneting db',
            musium: 'Speeeeeecial'
            
        }
    ]
    )

    */
})

app.get('/api/home1/about2', (req, res) =>
{

    console.log('홈1 데이터2 주고받기')

    Imagedb.findAll({
        limit : 3
    })
    .then((result) => {
        console.log(result[0].artist);
        res.json([
        {
            name : result[0].artist,
            '전시 관람 체류 시간' : result[0].remaintime,
            '전시 관람객': result[0].audiencenum
        },
        {
            name : result[1].artist,
            '전시 관람 체류 시간' : result[1].remaintime,
            '전시 관람객': result[1].audiencenum
        },
        {
            name : result[2].artist,
            '전시 관람 체류 시간' : result[2].remaintime,
            '전시 관람객': result[2].audiencenum
        },
    
    
    ])
        
    })
    .catch(err => { throw err })

})





app.get('/api/home2',(req,res) => {
    console.log('홈2 알림')
    Imagedb.findOne({
        order : [['id','DESC']]
    })
    .then(result => {
        
        res.json(result)})
    .catch(
        err => {throw err}
    )
})


app.get('/api/home3/slider2', function (req, res) {
    res.json(
        [
           {
                artist:'mango1',
                type:'타입1',
                size:'사이즈1',
                musium:'미술관1',
                imgUrl:'picture.png'
           },
           {
            artist:'mango2',
            type:'타입2',
            size:'사이즈2',
            musium:'미술관2',
            imgUrl:'picture.png'
          },
            {
                    artist:'mango3',
                    type:'타입3',
                    size:'사이즈3',
                    musium:'미술관3',
                    imgUrl:'picture.png'
            },
            {
                artist:'mango4',
                type:'타입4',
                size:'사이즈4',
                musium:'미술관4',
                imgUrl:'picture.png'
            },
            {
                artist:'mango5',
                type:'타입5',
                size:'사이즈5',
                musium:'미술관5',
                imgUrl:'picture.png'
            },
            {
                artist:'mango6',
                type:'타입6',
                size:'사이즈6',
                musium:'미술관6',
                imgUrl:'picture.png'
            }
        ]
    );
});

app.get('/api/home3/slider', function (req, res) {
    Imagedb.findAll({
        limit:5,
        order : [['id','DESC']]
   })
   .then((result) => {
    res.json([
        {
            artist: result[0].artist,
            artwork: result[0].artname,
            musium: result[0].exhibition,
            imgUrl: result[0].imageurl
       },
        {
            artist: result[1].artist,
            artwork: result[1].artname,
            musium: result[1].exhibition,
            imgUrl: result[1].imageurl
        },
        {
            artist: result[2].artist,
            artwork: result[2].artname,
            musium: result[2].exhibition,
            imgUrl: result[2].imageurl
        }/*,
        {
            artist: result[3].artist,
            artwork: result[3].artname,
            musium: result[3].exhibition,
            imgUrl: result[3].imageurl
        },
        {
            artist: result[4].artist,
            artwork: result[4].artname,
            musium: result[4].exhibition,
            imgUrl: result[4].imageurl
        }*/

    ])
   })
   .catch( err => {throw err})

   
});

app.get('/api/home3/graph', function (req, res) {
   Imagedb.findAll({
        limit:5,
        order : [['id','DESC']]
   })
   .then((result) => {
    res.json([
        {
            name : result[0].artist,
           '전시 관람 체류 시간' : result[0].remaintime,
           '전시 관람객': result[0].audiencenum
        },
        {
            name : result[1].artist,
           '전시 관람 체류 시간' : result[1].remaintime,
           '전시 관람객': result[1].audiencenum
        },
        {
            name : result[2].artist,
           '전시 관람 체류 시간' : result[2].remaintime,
           '전시 관람객': result[2].audiencenum
        }/*,
        {
            name : result[3].artist,
           '전시 관람 체류 시간' : result[3].remaintime,
           '전시 관람객': result[3].audiencenum
        },
        {
            name : result[4].artist,
           '전시 관람 체류 시간' : result[4].remaintime,
           '전시 관람객': result[4].audiencenum
        }*/

    ])
   })
   .catch( err => {throw err})

    
});

app.get('/api/home3/date', function (req, res) {
    res.json(
        [
            {
                data: "a 일정 12~13"
            }
              ,
            {
                data: "b 일정 13~14"
            }
            ,
            {
                data: "c 일정 13~14"
            },
            {
                data: "d 일정 14~15"
            }
            ,
            {
             
                data: "e 일정 16~17"
            }
            ,
            {
                data: "f 일정 14~15"
            }
            ,
            {
                data: "g 일정 16~17"
            }
        ]
    );
});


app.get('/api/home4/data', function (req, res) {
   
   Imagedb.findAll({
        limit:3,
        order : [['id','DESC']]
   })
   .then((result) => {
       res.json([
           {
            artist: result[0].artist,
            artwork: result[0].artname,
            imgUrl: result[0].imageurl,
            moreUrl:'#'
           },
           {
            artist: result[1].artist,
            artwork: result[1].artname,
            imgUrl: result[1].imageurl,
            moreUrl:'#'
           },
           {
            artist: result[2].artist,
            artwork: result[2].artname,
            imgUrl: result[2].imageurl,
            moreUrl:'#'
           },
        ])
   })
   .catch( err => {throw err})
   
});

    
app.get('/api/exhibition1/data', function (req, res) {
    
    
    Imagedb.findAll({

    })
    .then((result) => {

        res.json([
            {
                artist: result[0].artist,
                day:'day1',
                imgUrl: result[0].imageurl,
                musium: result[0].exhibition

            },
        ])
    })
    .catch(err => {throw err})

    
    });

    app.get('/api/exhibition2/exhibition', function (req, res) {
        res.json(
            [
                {
                    artist:'Joan Miro',
                    day:'apr 10 - may 11, 2021',
                    musium:'MoMA Museum',
                    img:'picture.png',
                    artworkUrl:'#',
                    textTitle:'국가는 노인과 청소년의 복지향상',
                    textArea:' 을 위한 정책을 실시할 의무를 진다. 언론·출판에 대한 허가나 검열과 집회·결사에 대한 허가는 인정되지 아니한다. 학교교육 및 평생교육을 포함한 교육제도와 그 운영, 교육재정 및 교원의 지위에 관한 기본적인 사항은 법률로 정한다.신체장애자 및 질병·노령 기타의 사유로 생활능력이 없는 국민은 법률이 정하는 바에 의하여 국가의 보호를 받는다. 대통령은 제3항과 제4항의 사유를 지체없이 공포하여야 한다.원장은 국회의 동의를 얻어 대통령이 임명하고, 그 임기는 4년으로 하며, 1차에 한하여 중임할 수 있다. 모든 국민은 근로의 권리를 가진다. 국가는 사회적·경제적 방법으로 근로자의 고용의 증진과 적정임금의 보장에 노력하여야 하며, 법률이 정하는 바에 의하여 최저임금제를 시행하여야 한다.선거에 있어서 최고득표자가 2인 이상인 때에는 국회의 재적의원 과반수가 출석한 공개회의에서 다수표를 얻은 자를 당선자로 한다. 공무원의 신분과 정치적 중립성은 법률이 정하는 바에 의하여 보장된다.헌법재판소는 법관의 자격을 가진 9인의 재판관으로 구성하며, 재판관은 대통령이 임명한다. 국가는 과학기술의 혁신과 정보 및 인력의 개발을 통하여 국민경제의 발전에 노력하여야 한다.',
                    datenumber:351,
                    totalnumber:'194:36:41',
                    time:'2020. 02. 08 PM 14:00 기준'
                }
            ])
        });

        app.get('/api/exhibition2/rank', function (req, res) {
            res.json(
                [
                    {
                        rank : 1,
                        art : 'Joan Miro : composition(painting)',
                        looktime : '194:36:41'
                    },
                    {
                        rank : 2,
                        art : 'Joan Miro : composition(painting)',
                        looktime : '194:36:41'
                    },
                    {
                        rank : 3,
                        art : 'Joan Miro : composition(painting)',
                        looktime : '194:36:41'
                    },
                    {
                        rank : 4,
                        art : 'Joan Miro : composition(painting)',
                        looktime : '194:36:41'
                    },
                    {
                        rank : 5,
                        art : 'Joan Miro : composition(painting)',
                        looktime : '194:36:41'
                    },
                    {
                        rank : 6,
                        art : 'Joan Miro : composition(painting)',
                        looktime : '194:36:41'
                    }
                ])
            });

            app.get('/api/exhibition2/chart03/day', function (req, res) {
                res.json(
                    [
                        {
                            name: '10:00',
                            '관람객': 1000,
                          },
                          {
                            name: '11:00',
                            '관람객': 2000,
                          },
                          {
                            name: '12:00',
                            '관람객': 1500,
                          },
                          {
                            name: '13:00',
                            '관람객': 2000,
                          },
                          {
                            name: '14:00',
                            '관람객': 1700,
                          },
                          {
                            name: '15:00',
                            '관람객': 900,
                          },
                          {
                            name: '16:00',
                            '관람객': 800,
                          },
                          {
                            name: '17:00',
                            '관람객': 1200,
                          },
                          {
                            name: '18:00',
                            '관람객': 2500,
                          },
                          {
                            name: '19:00',
                            '관람객': 700,
                          }
                    ])
                });

                app.get('/api/exhibition2/chart04', function (req, res) {
                    res.json(
                        [
                            { name: '10-20대', value: 600 },
                            { name: '30-40대', value: 230 },
                            { name: '50-60대', value: 150 },
                            { name: '70대 이상',  value: 70 }
                        ])
                    });
        
                    app.get('/api/exhibition3/exhibition', function (req, res) {

                        var date = moment().format('YYYY-MM-DD HH:mm:ss');

                        Imagedb.findOne({
                            order : [['id','DESC']]
                        })
                        .then((result) => {
                            
                            res.json([{
                                    artist: result.artist,
                                    arttype:'Composition(painting)',
                                    artsize:'1933, Oil On Canvas, 150X150',
                                    imgUrl: result.imageurl,
                                    musium: result.exhibition,
                                    people_number: 351,
                                    total_people_number: 9510,
                                    time : date +'기준',
                                    totaltime: '283:36:41'

                            }])

                        })
                        .catch(err => {throw err})
                       




                        });

                        app.post('/api/exhibition3/chart05', function (req, res) {
                            console.log(req.body.date)
                            switch(req.body.date)
                            {
                                case 'day':
                                    res.json(
                                        [
                                            {
                                                name: '10',
                                                'Day': 10,
                                              },
                                              {
                                                name: '11',
                                                'Day': 11,
                                              },
                                              {
                                                name: '12',
                                                'Day': 15,
                                              },
                                              {
                                                name: '13',
                                                'Day': 20,
                                              },
                                              {
                                                name: '14',
                                                'Day': 17,
                                              },
                                              {
                                                name: '15',
                                                'Day': 9,
                                              },
                                              {
                                                name: '16',
                                                'Day': 8,
                                              },
                                              {
                                                name: '17',
                                                'Day': 12,
                                              },
                                              {
                                                name: '18',
                                                'Day': 19,
                                              },
                                              {
                                                name: '19',
                                                'Day': 7,
                                              }
                                        ])
                                        break;

                                case 'week':
                                    res.json(
                                        [
                                            {
                                                name: '10',
                                                'Day': 10,
                                              },
                                              {
                                                name: '11',
                                                'Day': 11,
                                              },
                                              {
                                                name: '12',
                                                'Day': 15,
                                              },
                                              {
                                                name: '13',
                                                'Day': 20,
                                              },
                                              {
                                                name: '14',
                                                'Day': 17,
                                              },
                                              {
                                                name: '15',
                                                'Day': 9,
                                              },
                                              {
                                                name: '16',
                                                'Day': 8,
                                              },
                                              {
                                                name: '17',
                                                'Day': 12,
                                              },
                                              {
                                                name: '18',
                                                'Day': 19,
                                              },
                                              {
                                                name: '19',
                                                'Day': 7,
                                              }
                                        ])
                                        break;

                                case 'month':
                                    res.json(
                                        [
                                            {
                                                name: '10',
                                                'Day': 30,
                                              },
                                              {
                                                name: '11',
                                                'Day': 21,
                                              },
                                              {
                                                name: '12',
                                                'Day': 15,
                                              },
                                              {
                                                name: '13',
                                                'Day': 20,
                                              },
                                              {
                                                name: '14',
                                                'Day': 17,
                                              },
                                              
                                        ])
                                        break;

                                case 'year':
                                    res.json(
                                        [
                                            {
                                                name: '10',
                                                'Day': 100,
                                              },
                                              {
                                                name: '11',
                                                'Day': 121,
                                              },
                                              {
                                                name: '12',
                                                'Day': 115,
                                              }
                                        ])
                            }

                           
                            });


                            app.get('/api/artist/img', function (req, res) {
                                res.json(
                                    [
                                        {
                                            imgUrl: "picture.png"
                                        },
                                        {
                                            imgUrl: "picture.png"
                                        },
                                        {
                                            imgUrl: "picture.png"
                                        },
                                        {
                                            imgUrl: "picture.png"
                                        },
                                        {
                                            imgUrl: "picture.png"
                                        },
                                        {
                                            imgUrl: "picture.png"
                                        },
                                        {
                                            imgUrl: "picture.png"
                                        },
                                        {
                                            imgUrl: "picture.png"
                                        },
                                        {
                                            imgUrl: "picture.png"
                                        },
                                        {
                                            imgUrl: "picture.png"
                                        },
                                        {
                                            imgUrl: "picture.png"
                                        },
                                        {
                                            imgUrl: "picture.png"
                                        }
                                         
                                    ])
                                });

                                app.get('/api/artist01/slider', function (req, res) {
                                    res.json(
                                        [
                                            {
                                                artist:'Joan Miro9',
                                                type:'Composition(painting)',
                                                size:'1933, Oil On Canvas, 150X150',
                                                musium:'Sema Museum',
                                                imgUrl : 'picture.png'
                                            },
                                            {
                                                artist:'Joan Miro8',
                                                type:'Composition(painting)',
                                                size:'1933, Oil On Canvas, 150X150',
                                                musium:'Sema Museum',
                                                imgUrl : 'picture.png'
                                            },
                                            {
                                                artist:'Joan Miro7',
                                                type:'Composition(painting)',
                                                size:'1933, Oil On Canvas, 150X150',
                                                musium:'Sema Museum',
                                                imgUrl : 'picture.png'
                                            },
                                            {
                                                artist:'Joan Miro6',
                                                type:'Composition(painting)',
                                                size:'1933, Oil On Canvas, 150X150',
                                                musium:'Sema Museum',
                                                imgUrl : 'picture.png'
                                            },
                                            {
                                                artist:'Joan Miro5',
                                                type:'Composition(painting)',
                                                size:'1933, Oil On Canvas, 150X150',
                                                musium:'Sema Museum',
                                                imgUrl : 'picture.png'
                                            },
                                            {
                                                artist:'Joan Miro4',
                                                type:'Composition(painting)',
                                                size:'1933, Oil On Canvas, 150X150',
                                                musium:'Sema Museum',
                                                imgUrl : 'picture.png'
                                            },
                                            {
                                                artist:'Joan Miro3',
                                                type:'Composition(painting)',
                                                size:'1933, Oil On Canvas, 150X150',
                                                musium:'Sema Museum',
                                                imgUrl : 'picture.png'
                                            },
                                            {
                                                artist:'Joan Miro2',
                                                type:'Composition(painting)',
                                                size:'1933, Oil On Canvas, 150X150',
                                                musium:'Sema Museum',
                                                imgUrl : 'picture.png'
                                            },
                                            {
                                                artist:'Joan Miro1',
                                                type:'Composition(painting)',
                                                size:'1933, Oil On Canvas, 150X150',
                                                musium:'Sema Museum',
                                                imgUrl : 'picture.png'
                                            }
                                        ])
                                    });
                                    app.get('/api/artist01/artist', function (req, res) {
                                        res.json(
                                            [
                                                {
                                                    name: 'Joan Miro',
                                                    btnUrl: '#',
                                                    textArea: `호안 미로 이 페라(카탈루냐어: Joan Miró i Ferrà 주안 미로 이 페라[1], 1893년 4월 20일 ~ 1983년 12월 25일)은 스페인 카탈루냐 지방의 바르셀로나 출신의 화가, 조각가, 도예가이다.

                                                    바르셀로나 근처인 몬토로이크에서 출생하여 바르셀로나 미술 학교를 중퇴하고 1919년 파리로 나와 작품 활동을 시작하였다. 초기의 작품에는 사물에 대한 정밀한 형태적 감수성과 친밀감이 드는 서정적인 감동이 조화를 이루고 있다. 1923년부터 바실리 칸딘스키의 영향을 받아 초현실주의 화풍으로 바뀌었다. 그의 작품은 밝고 가벼운 색채와 소박하며 단순한 형식으로 이루어져 신선한 정서가 풍긴다. 1928년에는 네덜란드를 여행하였고, 그 해에 미국에서 개인전을 열었다. 1937년 파리 만국 박람회에 출품한 〈추수〉가 유명하다. 1947년 미국으로 건너가 신시내티 호텔 벽화, 하버드 대학 벽화를 그렸다. 1948년 귀국한 후로는 파리와 바르셀로나에서 제작생활을 하였다. 1954년 베네치아 국제전에서 판화 부문 국제상을 받았다. 1983년 12월 25일 성탄절에 90세의 나이로 사망하였다.
                                                    
                                                    미로의 작품에는 초현실주의 특유한 어두운 느낌이나 심리묘사는 적고 밝은 소박성이 특질이며 모두를 순수한 상징기호로 바꾸어 가는 매력이 있다. 대표작으로 〈야곡〉 〈곡립의 귀〉 〈해맑은 웃음〉 등이 있다.`,
                                                    people_num: '35121',
                                                    totaltime: '1894:36:41',
                                                    timeline: '2021년 7월 20일 15시 30분 기준',
                                                    like: '60'
                                                }
                                            ]
                                        )
                                    })

                                    app.get('/api/artwork/data', function (req, res) {
                                        res.json(
                                            [
                                                {
                                                    img:  'picture.png',
                                                    text: 'Pablo Picasso : Portrait6'
                                                },
                                                {
                                                    img:  'picture.png',
                                                    text: 'Pablo Picasso : Portrait'
                                                },
                                                
                                                {
                                                    img:  'picture.png',
                                                    text: 'Pablo Picasso : Portrait5'
                                                },
                                                
                                                {
                                                    img:  'picture.png',
                                                    text: 'Pablo Picasso : Portrait'
                                                },
                                                
                                                {
                                                    img:  'picture.png',
                                                    text: 'Pablo Picasso : Portrait4'
                                                },
                                                
                                                {
                                                    img:  'picture.png',
                                                    text: 'Pablo Picasso : Portrait'
                                                },
                                                
                                                {
                                                    img:  'picture.png',
                                                    text: 'Pablo Picasso : Portrait3'
                                                },
                                                
                                                {
                                                    img:  'picture.png',
                                                    text: 'Pablo Picasso : Portrait'
                                                },
                                                
                                                {
                                                    img:  'picture.png',
                                                    text: 'Pablo Picasso : Portrait'
                                                },
                                                
                                                {
                                                    img:  'picture.png',
                                                    text: 'Pablo Picasso : Portrait2'
                                                },
                                                
                                                {
                                                    img:  'picture.png',
                                                    text: 'Pablo Picasso : Portrait1'
                                                }
                                                
                                                
                                                 
                                            ])
                                        });



    app.post('/api/checkId', (req,res) => {
        if(req.body.username=='')
        {
            
            res.json({
                success:'null'
            })
        }

        User.findOne({
            where : {username: req.body.username}
        })
        .then((result) => {
            

            if(result == null)
            {
                
                res.json({
                    success:true
                })
            }

            else{
                
                res.json({
                    success:false
                })
            }
        })
        .catch(err => {throw err})
    })

app.post('/api/myPage', (req,res) => {
    console.log("받아온 토큰 : "+req.body.user)

    if(req.body.user == undefined || req.body.user == '')
    {
        res.json({
            success:false
        })
    }

    try{
        var decode = jwt.verify(req.body.user,tokenKey);
        console.log("복호화 토큰 : "+decode.userid);

        
        User.findOne({
            where : {id:decode.userid}
        })
        .then((result) => {
            res.json({
                username:result.username,
                name: result.name,
                email: result.email,
                success:true
            })
        })

    }catch(err){
        console.log(err)
    }

})


app.post('/api/myPagefindUser', (req,res) => {
    if(req.body.username == '' || req.body.username == undefined || req.body.username==null)
    {
        return res.json({
           name: false
        })
    }

    User.findOne({
        where : {username : req.body.username}
    })
    .then((result) => {

        if(result == null)
        {
            console.log('찾는 유저 없음')
            return res.json({
                name: false
             })
        }

        else{
            res.json({
                username:result.username,
                id : result.id,
                name : result.name,
                idCode : '1001',
                email : result.email
            })
    }
    })
    .catch()

})

app.post('/api/Transfer/artdata',(req,res) => {
    console.log("받아온 토큰 : "+req.body.user)

    if(req.body.user == undefined || req.body.user == '')
    {
        res.json({
            success:false
        })
    }

    try{
        var decode = jwt.verify(req.body.user,tokenKey);
        console.log("복호화 토큰 : "+decode.userid);

        
        User.findOne({
            where : {id:decode.userid}
        })
        .then((result) => {
            Imagedb.findAll({
                where: {owner: result.username}
            })
            .then((result2) => {
                res.json(result2)
            })
        })

    }catch(err){
        console.log(err)
    }



    
})


app.post('/api/Transfer/sendArt',(req,res) => {
    
    console.log(req.body.checkBoxValue + "\n" +req.body.username )
    
    for(let i=0; i< req.body.checkBoxValue.length ; i++)
    {
        console.log(req.body.checkBoxValue[i])

        Imagedb.update({owner: req.body.username},{where : {id : req.body.checkBoxValue[i]}
        })
        .then(() => {
            console.log(i+'번쨰 성공')
        })
        .catch()
        

    }

    res.json({
        result: true
    })
})




app.listen(PORT, () => {
    console.log(`Server run: http://localhost:${PORT}/`)
})