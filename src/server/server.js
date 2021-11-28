const express = require('express');
const app = express();
//const db = require('./config/db');
const cors = require("cors");

//오라클 추가사항
var oracledb = require('oracledb');
var dbConfig = require('./config/dbConfig');

//오라클 추가사항 end



//const dev_ver = require("../pages/global_const");
const corsOptions = {
    origin : true,
    credentials : true,
}

const fs = require('fs');

const cookieParser = require('cookie-parser');
/*
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRound = 16;
const tokenKey = 'veryveryveryImportantToKeepIt';
*/
const multer = require('multer');

const moment = require('moment');
require('moment-timezone');
moment.tz.setDefault("Asia/Seoul");
/*
const sequelize = require('./models').sequelize;
sequelize.sync();

const {
    User,
    Imagedb,
    Auctiondb,
    Displaydb,
    Artistdb,
    User_dib_db,
    Sequelize: { Op }
  } = require('./models');

//const auctiondb = require('./models/auctiondb');
sequelize.query('SET NAMES utf8;');
*/
const PORT = process.env.PORT || 4000;

app.use(express.json());

app.use(cors(corsOptions));

app.get('/', (req, res) => {
    res.send({test:'Server Response Sucess'});
});


/*로그인 추가사항 */
//const http = require('http')
var serveStatic = require('serve-static'); 
var path = require('path');
var session = require('express-session');
var bodyParser_post = require('body-parser');       //post 방식 파서
//const nodedb = require('./models/nodedb');
//const { connect } = require('http2');
//const { IfFulfilled } = require('react-async');
//const { connectionClass } = require('oracledb');


//const FileStore = require('session-file-store') (session)



//join은 __dirname : 현재 .js 파일의 path 와 public 을 합친다
//이렇게 경로를 세팅하면 public 폴더 안에 있는것을 곧바로 쓸 수 있게된다
app.use(serveStatic(path.join(__dirname, 'public')));
 
 
//post 방식 일경우 begin
//post 의 방식은 url 에 추가하는 방식이 아니고 body 라는 곳에 추가하여 전송하는 방식
app.use(bodyParser_post.urlencoded({ extended: false }));            // post 방식 세팅
app.use(bodyParser_post.json());                                     // json 사용 하는 경우의 세팅
//post 방식 일경우 end

//쿠키와 세션을 미들웨어로 등록한다
//app.use(cookieParser());
app.use(cookieParser('session-secret-key'));
//세션 환경 세팅
//세션은 서버쪽에 저장하는 것을 말하는데, 파일로 저장 할 수도 있고 레디스라고 하는 메모리DB등 다양한 저장소에 저장 할 수가 있는데



app.use(session({
    secret: 'my key',           //이때의 옵션은 세션에 세이브 정보를 저장할때 할때 파일을 만들꺼냐
                                //아니면 미리 만들어 놓을꺼냐 등에 대한 옵션들임
    resave: false,
    //store: new FileStore(),
    saveUninitialized:false,
    cookie:{
    //    expires: 60*60*24*1000
    //domain:'artdata',path:'/'
    }
}));
/*
app.use(function(req, res) {

    res.header('Access-Control-Allow-Credentials', true);
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    res.header("Access-Control-Allow-Origin", process.env.ORIGIN);
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-   Type, Accept, Authorization");
    });
*/
app.set('trust proxy',1)

/* */

//줄바꿈 처리
//var nl2br  = require('nl2br')


app.use('/file', express.static('../public')); 
app.use('/text', express.static('../public/text')); 
app.use('/img', express.static('../public/img')); 
app.use('/pdf', express.static('../public/pdf')); 


app.use(cookieParser());

var _storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if(file.mimetype=='image/png' || file.mimetype=='image/jpeg')
            cb(null, 'public/img/') // cb 콜백함수를 통해 전송된 파일 저장 디렉토리 설정

        else if(file.mimetype=='application/pdf')
            cb(null, 'public/pdf/')


        else
            cb(null,'public/text/')
    },

    filename: function (req, file, cb) {
      cb(null, file.originalname) // cb 콜백함수를 통해 전송된 파일 이름 설정
    }
  });

//const upload2 = multer({dest: 'upload/'})
const upload = multer({ storage: _storage });//이렇게하지않으면 filename이 undefined가 나오게됨.

app.post('/api/fileupload', upload.single('file'), function(req, res){
   
    console.log(req.file); // 콘솔(터미널)을 통해서 req.file Object 내용 확인 가능.
   // if(req.file.mimetype=='image/png' || req.file.mimetype=='image/jpeg')
    //{
        
    //}
    res.json({
        success:true
    })
  


  });

app.post('/api/artist_upload',(req,res) => {

    let jsondata = {}

    if(req.body.artist != undefined && req.body.artist.length>=1)
        {
            jsondata.artist = req.body.artist
        }

    if(req.body.life_term != undefined && req.body.life_term.length>=1)
        {
            jsondata.life_term = req.body.life_term
        }

    if(req.body.filename != undefined && req.body.filename.length>=1)
    {
        jsondata.filename = req.body.filename
    }

    if(req.body.artistInfo != undefined && req.body.artistInfo.length>=1)
    {
        jsondata.artist_info = (req.body.artistInfo)
    }

    if(req.body.artistyearInfo != undefined && req.body.artistyearInfo.length>=1)
    {
        jsondata.artistyearInfo = (req.body.artistyearInfo)
    }



    oracledb.fetchAsString = [oracledb.CLOB]
    oracledb.getConnection({
        user : dbConfig.user,
        password : dbConfig.password,
        connectString : dbConfig.connectString
    },
    async function(err, connection){
        if(err)
        {
            console.error(err.message);
            return;
        }
        else
        {
            if(req.body.id==undefined || req.body.id.length<1)
            {
               
                var query = "select * from (select artist_id from artist order by artist_id desc) where rownum = 1"
                var result = await connection.execute(query)

                var idnum
                if(result.row!=undefined)
                {
                    idnum = Number(result.rows[0][0])+1
                    console.log("추가 : "+idnum)
                }
                else{
                    idnum = 1
                }
                query = "insert into artist values (:1, :2, :3, :4, :5)"
                var result2 = await connection.execute(query,[
                    idnum,
                    req.body.artist,
                    req.body.artistInfo,
                    req.body.life_term,
                    req.body.artistyearInfo
                ])

                if(result2.rowsAffected>0)
                {
                    connection.commit()
                    res.json({
                        success:true
                    })
                }
                else{
                    res.json({
                        success:err
                    })
                }
            }
            else{
                console.log("수정할 id : "+req.body.id)
                
                var query = "update artist set artist_name = :1, artist_info = :2, life_term =  :3, artist_career = :4 where artist_id = :5"
                var result2 = await connection.execute(query,[
                   
                    req.body.artist,
                    req.body.artistInfo,
                    req.body.life_term,
                    req.body.artistyearInfo,
                    Number(req.body.id)
                ])

                if(result2.rowsAffected>0)
                {
                    connection.commit()
                    res.json({
                        success:true
                    })
                }
                else{
                    res.json({
                        success:err
                    })
                }

            }

        }
    })


   /*
    if(req.body.id==undefined || req.body.id.length<1)
    {
        

     
        Artistdb.create(jsondata)
        .then(()=>{
            res.json({
                success:true
            })
        })
        .catch((err)=>{
            res.json({
                success:err
            })
        })
        
    }

    else{
        console.log("수정할 id : "+req.body.id)

/*
        Artistdb.update(jsondata,{
            where:{id: req.body.id}
        })
        .then(()=>{
            res.json({
                success:true
            })
        })
        .catch((err)=>{
            res.json({
                success:err
            })
        })

    }
    */
})


app.post('/api/artist_upload/search',(req,res)=>{
    //
    oracledb.fetchAsString = [oracledb.CLOB]
    oracledb.getConnection({
        user : dbConfig.user,
        password : dbConfig.password,
        connectString : dbConfig.connectString
    },
    async function(err, connection){
        if(err)
        {
            console.error(err.message);
            return;
        }
        else
        {
            var query = "select artist_name, life_term, Artist_info, Artist_career from artist where artist_id = :id"

            connection.execute(query, {id : req.body.id},(err,result)=>{
                if(err)
                {
                    console.log(err)
                }
                else if(result.rows!=undefined)
                {
                    res.json({
                        artist: result.rows[0][0],
                        life_term: result.rows[0][1],
                        artist_info:result.rows[0][2],
                        artistyearInfo:result.rows[0][3]
                    })
                }
            })
        }
    })

/*
    Artistdb.findOne({
        where:{id:req.body.id}
    })
    .then((result)=>{
        res.json(result)
    })
    .catch((err)=>{
        res.json(err)
    })
    */
})

app.post('/api/imgupload',(req,res) => {

    

    if(req.body.id==undefined || req.body.id.length<1)
    {
        console.log("artist : "+req.body.artist)

                    



        oracledb.getConnection({
            user : dbConfig.user,
            password : dbConfig.password,
            connectString : dbConfig.connectString
        },
        async function(err, connection){
            if(err)
            {
                console.error(err.message);
                return;
            }
            
            var query = "select * from (select art_id from art order by art_id desc) where rownum = 1"
            var result = await connection.execute(query)

            var idnum
            if(result.rows!=undefined)
            {
                idnum = Number(result.rows[0][0])+1
                console.log("추가 : "+idnum)
            }
            else{
                idnum = 1
            }
            console.log(req.body)
            console.log("idnum : "+idnum)

            var query = "insert into art values (:1, :2, :3, :4, :5, :6, :7, :8, :9, :10, :11, :12, :13, :14, :15, :16, :17, :18)"
    
            await connection.execute(query,
                 [
                    idnum,
                    req.body.artname,
                    null,
                    req.body.imagesize,
                    req.body.imageurl,
                    req.body.imagetype,
                    req.body.arttext,
                    Number(req.body.USD_upper),
                    Number(req.body.USD_lower),
                    Number(req.body.KRW_upper),
                    Number(req.body.KRW_lower),
                    req.body.artrelease_date,
                    100,
                    100,
                    Number(req.body.artist),
                    Number(req.body.exhibition),
                    null,
                    null
                 ],
                 {
                     autoCommit:true
                 },(err, result)=>{
                    if(err)
                    {
                        console.log(err)
                         res.json({success:false})
                    }
                    else if(result.rowsAffected>0)
                    {
                        res.json({success:true})
                    }
                    else
                    {
                        res.json({notexist:true})
                    }

                   
                 })
    
            
        })

        /*
        Imagedb.create(req.body)
        .then(()=> {
            res.json({success:true})
        })
        .catch((err)=>{
            console.log(err)
            res.json({success:false})
        })*/
    }
    else
    {
        console.log("수정할 id : "+req.body.id)

        oracledb.getConnection({
            user : dbConfig.user,
            password : dbConfig.password,
            connectString : dbConfig.connectString
        },
        async function(err, connection){
            if(err)
            {
                console.error(err.message);
                return;
            }
            console.log(req.body.artist)


            if(req.body.imageurl !=undefined)
            {
                var query = "update art set Art_name = :1,  Image_size= :2, Image_url = :3, Image_type = :4, Art_text = :5, usd_upper = :6, usd_lower =:7, krw_upper = :8, krw_lower = :9, Displaydate = :10,  Artist_id = :11, Exhibition_id = :12 where art_id = :13"
                var exhibition = req.body.exhibition == null ? null : Number(req.body.exhibition)
                await connection.execute(query,
                    [
                        
                        req.body.artname,
                        req.body.imagesize,
                        req.body.imageurl,
                        req.body.imagetype,
                        req.body.arttext,
                        Number(req.body.USD_upper),
                        Number(req.body.USD_lower),
                        Number(req.body.KRW_upper),
                        Number(req.body.KRW_lower),
                        req.body.artrelease_date,

                        Number(req.body.artist),
                        exhibition,

                        Number(req.body.id)
                    ],
                    {
                        autoCommit:true
                    },(err, result)=>{
                        if(err)
                        {
                            console.log(err)
                            res.json({success:false})
                        }
                        else if(result.rowsAffected>0)
                        {
                            res.json({success:true})
                        }
                        else
                        {
                            res.json({notexist:true})
                        }
                    })

                }
                else{
                    var query = "update art set Art_name = :1,  Image_size= :2, Image_type = :3, Art_text = :4, usd_upper = :5, usd_lower =:6, krw_upper = :7, krw_lower = :8, Displaydate = :9,  Artist_id = :10, Exhibition_id = :11 where art_id = :12"
        
                    await connection.execute(query,
                        [
                            
                            req.body.artname,
                            req.body.imagesize,
                            req.body.imagetype,
                            req.body.arttext,
                            Number(req.body.USD_upper),
                            Number(req.body.USD_lower),
                            Number(req.body.KRW_upper),
                            Number(req.body.KRW_lower),
                            req.body.artrelease_date,
    
                            Number(req.body.artist),
                            Number(req.body.exhibition),
    
                            Number(req.body.id)
                        ],
                        {
                            autoCommit:true
                        },(err, result)=>{
                            if(err)
                            {
                                console.log(err)
                                res.json({success:false})
                            }
                            else if(result.rowsAffected>0)
                            {
                                res.json({success:true})
                            }
                            else
                            {
                                res.json({notexist:true})
                            }
                        })
                }
            
        })
        /*
        Imagedb.update(req.body,{
            where:{id: req.body.id}
        })
        .then(()=> {
            res.json({success:true})
        })
        .catch((err)=>{
            console.log(err)
            res.json({success:false})
        })
        */
    }

});

app.post('/api/imgupload/search',(req,res) => {

    oracledb.fetchAsString = [oracledb.CLOB]
    oracledb.getConnection({
        user : dbConfig.user,
        password : dbConfig.password,
        connectString : dbConfig.connectString
    },
    async function(err, connection){
        if(err)
        {
            console.error(err.message);
            return;
        }

        var query = "select artist_id, art_name, exhibition_id, Displaydate, Image_size, Image_type, KRW_lower, KRW_upper, USD_lower,USD_upper, Art_text from art where art_id = :1"
        var result = await connection.execute(query,[Number(req.body.id)])
    
        if(result.rows!=undefined)
        {
            //console.log(result.rows)
            res.json({
                artist : result.rows[0][0],
                artname : result.rows[0][1],
                exhibition : result.rows[0][2],
                artrelease_date : result.rows[0][3],
                imagesize : result.rows[0][4],
                imagetype : result.rows[0][5],
                KRW_lower : result.rows[0][6],
                KRW_upper : result.rows[0][7],
                USD_lower : result.rows[0][8],
                USD_upper : result.rows[0][9],
                arttext : result.rows[0][10],

            })
        }
        else{
            res.json(null)
        }
    })


/*
    Imagedb.findOne({
        where:{id: req.body.id}
    })
    .then((result)=>{
        res.json(result)
    })
    .catch((err)=>{
        res.json(err)
    })
*/
})

app.post('/api/auction_upload',(req,res) =>{

    if(req.session.user!=undefined && req.session.user.username != undefined  && req.session.user.username.length>=1)
    {
        oracledb.fetchAsString = [oracledb.CLOB]
        oracledb.getConnection({
            user : dbConfig.user,
            password : dbConfig.password,
            connectString : dbConfig.connectString
        },
        async function(err, connection){
            if(err)
            {
                console.error(err.message);
                return;
            }
            else
            {
    
                    var query = "select * from (select auction_id from auction order by auction_id desc) where rownum = 1"
                    var result = await connection.execute(query)
                    var idnum
                    if(result.rows != undefined)
                    {
                        idnum = Number(result.rows[0][0])+1
                        console.log("추가 : "+idnum)   
                    }
                    else{
                        idnum = 1
                    }
                    query = "select a.art_id, a.artist_id, a.krw_lower from art a where a.art_id = :1 and not exists (select t.art_id from auction t where t.art_id = a.art_id)"
                    result = await connection.execute(query, [Number(req.body.art_id)])
    
                    console.log(result.rows)
                    if(result.rows!=undefined && result.rows[0] != undefined)
                    {
                        query = "insert into auction values (:1, :2, TO_DATE(:3,'YYYY-MM-DD'), TO_DATE(:4,'YYYY-MM-DD'), :5, :6, :7, :8, :9)"
                        var result2 = await connection.execute(query,[
                            idnum,
                            req.body.unit,
                            req.body.begintime,
                            req.body.endtime,
                            Number(result.rows[0][2]),
                            null,
                            req.session.user.username,
                            Number(result.rows[0][1]),
                            Number(result.rows[0][0])      
                            
                        ])
        
                        if(result2.rowsAffected>0)
                        {
                            connection.commit()
                            res.json({
                                success:true
                            })
                        }
                        else{
                            res.json({
                                success:false
                            })
                        }
                        
                    }
                    else{
                        res.json({
                            nosuchart:true
                        })
                    }
    
                   
    
            }
        })
    }
    else
    {
        res.json({
            notlogin:true
        })
    }

 


    /*
    Imagedb.findOne({
        where:{artname: req.body.artname}
    })
    .then((result)=>{
        Auctiondb.create({
            artname:req.body.artname,
            artistyear:req.body.artistyear,        
            begin_point:req.body.begintime,
            end_point: req.body.endtime,
            auction_unit:req.body.unit,
            artwork_id:result.id,
            artist:result.artist
        })
        .then((result) => {
            Imagedb.update({
                isauctioned:'yes'
            },{
                where:{artname:req.body.artname}
            })
            .then((find_result)=>{
                res.json({
                    success:true
                })

            })
            .catch((err)=>{
                res.json({
                    success:false,
                    err:err
                })
            })
         })
         .catch((err)=>{
            res.json({
                success:false,
                err:err
            })
        })
 
    })
    .catch((err)=>{
        res.json({
            success:false,
            err:err
        })
    })

 */

})



app.get('/img',(req,res)=>{
    console.log(__dirname+' 안됨? '+req.query.var1)
    //res.sendFile(__dirname+`/../upload/img/sign (2).png`);
    
    
    fs.readFile(__dirname+`/../../public/img/`+req.query.var1,(err,data)=>{
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

app.post('/api/searchArtwork/search',(req,res) => {
    //작품명 작가명 id
    //select a.art_id id, a.art_name, r.artist_name from art a, artist r where a.art_id = r.art_id and a.art_name like :1
    //req.body.input+'%'
    oracledb.fetchAsString=[oracledb.CLOB]
    oracledb.getConnection({
        user : dbConfig.user,
        password : dbConfig.password,
        connectString : dbConfig.connectString
    },
    async function(err, connection){
        if(err)
        {
            console.error(err.message);
            return;
        }

        var query = "select a.art_id, a.art_name, r.artist_name  from art a, artist r where a.art_name like :val and a.artist_id = r.artist_id"
        var like = req.body.input+"%"
        var result = await connection.execute(query, {val : like})

        var jsondata = []
        if(result.rows!=undefined)
        {
            result.rows.forEach((item)=>{
                var data = {
                    id : item[0],
                    artname : item[1],
                    artist : item[2]
                }
                //console.log(data)
                jsondata.push(data)
            })
        }

        res.json(jsondata)
    })

    /*
    Imagedb.findAll({
        where:{artname:{[Op.like]:req.body.input+'%'}}
    })
    .then((result)=>{
        
        
        res.json(result)
    })
    */
})

app.post('/api/searchArtwork/delete',(req,res) => {

    oracledb.getConnection({
        user : dbConfig.user,
        password : dbConfig.password,
        connectString : dbConfig.connectString
    },
    async function(err, connection){


        if(err)
        {
            console.error(err.message);

        }

        var option = {
            autoCommit: true,
                bindDefs: [
                    { type: oracledb.NUMBER }
                ]
        }
        var input = []
        console.log(req.body.checkBoxId)
        for(let i=0; i< req.body.checkBoxId.length; i++)
        {
            input.push([
                req.body.checkBoxId[i]
            ])

            
            /*
            Imagedb.destroy({
                where:{id: req.body.checkBoxId[i]}
            })
            .then(()=>{
                console.log(i+" 삭제완료")
            })
            .catch((err)=>{
                console.log(err)
            })*/
        }
        var query = "delete from art where art_id = :1"
        await connection.executeMany(query, input, option,
        (err, result)=>{

            if(err)
            {
                console.log(err)

                res.json({
                    success:false
                })
            }
            else if(result.rowsAffected>0)
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
       


    })
})


app.post('/api/searchArtist/search',(req,res) => {
    //select Artist_id, artist_name, life_term from artist where 

    oracledb.fetchAsString=[oracledb.CLOB]
    oracledb.getConnection({
        user : dbConfig.user,
        password : dbConfig.password,
        connectString : dbConfig.connectString
    },
    async function(err, connection){
        if(err)
        {
            console.error(err.message);
            return;
        }

        var query = "select r.artist_id, r.artist_name, r.life_term  from artist r where r.artist_name like :val"
        var like = req.body.input+"%"
        var result = await connection.execute(query, {val : like})

        var jsondata = []
        if(result.rows!=undefined)
        {
            result.rows.forEach((item)=>{
                var data = {
                    id : item[0],
                    artist : item[1],
                    life_term : item[2]
                }
                jsondata.push(data)
                //console.log(data)
            })
        }

        res.json(jsondata)
    })

/*
    Artistdb.findAll({
        where:{artist:{[Op.like]:req.body.input+'%'}}
    })
    .then((result)=>{
        
        
        res.json(result)
    })
    */
})

app.post('/api/searchArtist/delete',(req,res) => {

    console.log(req.body.checkBoxId)

    oracledb.getConnection({
        user : dbConfig.user,
        password : dbConfig.password,
        connectString : dbConfig.connectString
    },
    async function(err, connection){

        var option = {
            autoCommit: true,
                bindDefs: [
                    { type: oracledb.NUMBER }
                ]
        }

        if(err)
        {
            console.error(err.message);

        }

        console.log(req.body.checkBoxId)
        var input =[]
        for(let i=0; i< req.body.checkBoxId.length; i++)
        {
            input.push([
                Number(req.body.checkBoxId[i])
            ])
        }
        console.log(input)

        var query = "delete from artist where artist_id = :1"
        await connection.executeMany(query, input, option,
            (err, result)=>{

                if(err)
                {
                    console.log(err)

                    res.json({
                        success:false
                    })
                }
                else if(result.rowsAffected>0)
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

        


    })

    /*
    for(let i=0; i< req.body.checkBoxId.length; i++)
    {
        Artistdb.destroy({
            where:{id: req.body.checkBoxId[i]}
        })
        .then(()=>{
            console.log(i+" 삭제완료")
        })
        .catch((err)=>{
            console.log(err)
        })
    }

    res.json({
        seccess:true
    })*/
})




app.post('/api/joinForm',(req,res)=>
{
    console.log('회원가입');

    oracledb.getConnection({
        user : dbConfig.user,
        password : dbConfig.password,
        connectString : dbConfig.connectString
    },
    function(err, connection){
        if(err)
        {
            console.error(err.message);
            return;
        }

        //var binds = [[req.body.username]]
        let query = "INSERT INTO ARTUSER VALUES (:1, :2, :3, :4, :5, :6)"
        connection.execute(query, [
            req.body.username,
            req.body.name,
            req.body.password,
            req.body.email,
            req.body.phone,
            "ROLE_USER"],
            { autoCommit: true}
            ,
             async (err,result) =>
        {
            if(err)
            {
                console.error(err.message);
                doRelease(connection)
                return res.status(200).json({
                    success:false
                })
            }



            console.log("COMMIT 회원가입 성공")
            return res.status(200).json({
                success:true
            })


        })

        connection.close();
    })

    function doRelease(connection)
    {
        connection.release(
            function(err) {
                if (err) {
                    console.error(err.message);
                }
            });
    }

    //오라클 로그인 end


})

app.post('/api/loginForm',(req,res)=>
{
    console.log('로그인');

    //오라클 로그인
    oracledb.getConnection({
        user : dbConfig.user,
        password : dbConfig.password,
        connectString : dbConfig.connectString
    },
    function(err, connection){
        if(err)
        {
            console.error(err.message);
            return;
        }

        var uname = req.body.username
        
        let query = "select username, name, password, email,  role from artuser where username = :queryText";
        console.log("oracle질의 : "+query);
        connection.execute(query, {queryText : {dir : oracledb.BIND_IN, val : uname.trim(), type: oracledb.STRING}}, function(err,result)
        {
            if(err)
            {
                console.error(err.message);
                doRelease(connection)
                return;
            }

            console.log(result.metaData)
           // console.log(result.rows[0][0])
            
            
            if(result.rows==undefined || result.rows[0] == undefined || result.rows[0][2] != req.body.password)
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
                
                var roles = null
                
                req.session.user =
                {
                    id: result.rows[0][0],
                    username: result.rows[0][0],
                    email: result.rows[0][3],
                    name : result.rows[0][1],
                    
                    role: roles = result.rows[0][4].toUpperCase(),
                    
                    success:true,

                    authorized: true
                };

                req.session.save((err)=>{console.log(err)})

                console.log("세션 등록성공 : "+req.session)
                // 세션 ID
                const sessionID = req.sessionID;
                console.log('session id :', sessionID);
                    

                return res.json({
                        success: true,
                        session: req.session
                })
                //.render('/api/checkAdmin',{
                //    session : req.session
                //})
 
            }

            
        })

        connection.close();
    })

    function doRelease(connection)
    {
        connection.release(
            function(err) {
                if (err) {
                    console.error(err.message);
                }
            });
    }

    //오라클 로그인 end


})

app.get('/api/logout',(req,res)=>{
    req.session.destroy()
    res.json({
        success:true
    })
})




//여기서 부터 blog내용 적용

app.get('/api/home1/about', (req, res) =>
{
    //artist: '',artname: '',exhibition: '',imageurl:''

    oracledb.getConnection({
        user : dbConfig.user,
        password : dbConfig.password,
        connectString : dbConfig.connectString
    },
     function(err, connection){
        if(err)
        {
            
            console.error(err.message);
            return;
        }

        //var binds = [[req.body.username]]
        let query = "select * from (select r.artist_name, a.art_name, e.exhibition_name, a.Image_url , a.Art_id  from art a, artist r, exhibition e where a.artist_id = r.artist_id and a.exhibition_id = e.exhibition_id  order by a.art_id desc ) where rownum <= 3"
        connection.execute(query,
            
            async (err,result) =>
        {
            if(err)
            {
                console.error(err.message);
                
                return res.status(200).json({
                    success:false
                })
            }
            var strres = ""+ result.rows
            var array = strres.split(",")
            

            var jsondata = []

            if(result.rows != undefined)
            {
                result.rows.forEach((rows) => {
                    var data = {
                        artist: rows[0],
                        artname: rows[1],
                        exhibition: rows[2],
                        imageurl:rows[3],
                        art_id:rows[4]
                    }
    
                    //console.log('\n')
    
    
                    jsondata.push(data)
                })
            }

            return res.json(jsondata)


        })

        connection.close();
    })


})

app.get('/api/home1/about2', (req, res) =>
{
    //select * from select artist_name, remaintime, audiencenum  from art a, artist r order by release_date where rownum <= 3
    console.log('홈1 데이터2 주고받기')

    oracledb.getConnection({
        user : dbConfig.user,
        password : dbConfig.password,
        connectString : dbConfig.connectString
    },
     function(err, connection){
        if(err)
        {
            
            console.error(err.message);
            return;
        }

        //var binds = [[req.body.username]]
        let query = "select * from ( select a.art_name, a.Remaintime, a.Audience_number  from  art a order by Remaintime, Audience_number desc ) where rownum <= 3 "
        connection.execute(query,
            
            async (err,result) =>
        {
            if(err)
            {
                console.error(err.message);
                
                return res.status(200).json({
                    success:false
                })
            }
            
            

            var jsondata = []

            if(result.rows != undefined)
            {
                result.rows.forEach((rows) => {
                    var data = {
                        name : rows[0],
                        '전시 관람 체류 시간' : rows[1],
                        '전시 관람객': rows[2]
                    
                    }
    
                    //console.log('\n')
    
    
                    jsondata.push(data)
                })
            }

            return res.json(jsondata)


        })

        connection.close();
    })


/*
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
*/
})


app.get('/api/home2',(req,res) => {

    oracledb.fetchAsString = [ oracledb.CLOB ]//clob을 string으로 반환
    oracledb.getConnection({
        user : dbConfig.user,
        password : dbConfig.password,
        connectString : dbConfig.connectString
    },
     function(err, connection){
        if(err)
        {
            
            console.error(err.message);
            return;
        }

        //var binds = [[req.body.username]]
        let query = "select * from ( select  a.image_url, a.art_name, a.displaydate, r.artist_name, a.Art_text,  a.art_id  from  artist r, art a, exhibition e where r.artist_id = a.artist_id AND a.exhibition_id = e.exhibition_id order by art_id desc ) where rownum <= 1 "
        connection.execute(query,
            
            async (err,result) =>
        {
            if(err)
            {
                console.error(err.message);
                
                return res.status(200).json({
                    success:false
                })
            }

           
            var data = {
                    imageurl :result.rows[0][0],
                    artname : result.rows[0][1],
                    displaydate: result.rows[0][2],
                    artist: result.rows[0][3],
                    arttext: result.rows[0][4],
                    id:result.rows[0][5]
                }

                //console.log('\n')


                //jsondata.push(data)
           
            console.log(data)
            return res.json(data)


        })

        connection.close();
    })



    console.log('홈2 알림')
    /*
    Imagedb.findOne({
        order : [['id','DESC']]
    })
    .then(result => {
        
        res.json(result)})
    .catch(
        err => {throw err}
    )
    */
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
    //select * from select artist, remaintime, audiencenum  from art order by art_id where rownum <= 30

    oracledb.getConnection({
        user : dbConfig.user,
        password : dbConfig.password,
        connectString : dbConfig.connectString
    },
     function(err, connection){
        if(err)
        {
            
            console.error(err.message);
            return;
        }

        //var binds = [[req.body.username]]
        let query = "select * from (select r.artist_name, a.art_name, e.exhibition_name, a.Image_url , a.Art_id  from art a, artist r, exhibition e where a.artist_id = r.artist_id and a.exhibition_id = e.exhibition_id  order by a.art_id desc ) where rownum <= 15"
        connection.execute(query,
            
            async (err,result) =>
        {
            if(err)
            {
                console.error(err.message);
                
                return res.status(200).json({
                    success:false
                })
            }
            var strres = ""+ result.rows
            var array = strres.split(",")
            

            var jsondata = []

            if(result.rows!=undefined)
                result.rows.forEach((rows, index) => {
                    var data = {
                        artist: rows[0],
                        artwork: rows[1],
                        musium: rows[2],
                        imgUrl: rows[3],
                        id:rows[4]
                    }
                    

                    //console.log(data)
                    jsondata.push(data)

                })



            return res.json(jsondata)


        })

        connection.close();
    })

    /*
    Imagedb.findAll({
        limit: 30,
        order : [['id','DESC']]
   })
   .then((result) => {

    let result2 = [];
    
    for(let i=0; i<result.length; i++)
    {
        result2.push({
            artist: result[i].artist,
            artwork: result[i].artname,
            musium: result[i].exhibition,
            imgUrl: result[i].imageurl,
            id:result[i].id
        })
    }
    res.json(result2/*[
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
        }

    ])
   })
   .catch( err => {throw err})
    */
   
});

app.get('/api/home3/graph', function (req, res) {



    oracledb.getConnection({
        user : dbConfig.user,
        password : dbConfig.password,
        connectString : dbConfig.connectString
    },
     function(err, connection){
        if(err)
        {
            
            console.error(err.message);
            return;
        }

        //var binds = [[req.body.username]]
        let query = "select * from ( select art_name, Remaintime ,Audience_number  from art a order by art_id desc ) where rownum <= 5 "
        connection.execute(query,
            
            async (err,result) =>
        {
            if(err)
            {
                console.error(err.message);
                
                return res.status(200).json({
                    success:false
                })
            }

            

            var jsondata = []
           

            if(result.rows != undefined)
            {
                result.rows.forEach((array)=>{
                    var data = {name : array[0],
                        '전시 관람 체류 시간' : array[1],
                        '전시 관람객': array[2]}
    
                    //console.log('\n')
    
    
                    jsondata.push(data)
                })
            }

            return res.json(jsondata)


        })

        connection.close();
    })


    /*
   Imagedb.findAll({
        limit:5,
        order : [['id','DESC']]
   })
   .then((result) => {
       let result2 = [];

       for(let i=0; i< result.length; i++)
       {
           result2.push({
            name : result[i].artist,
            '전시 관람 체류 시간' : result[i].remaintime,
            '전시 관람객': result[i].audiencenum
           })
       }
    res.json(result2/*[
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
        }

    ])
   })
   .catch( err => {throw err})
   */
    
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

    oracledb.getConnection({
        user : dbConfig.user,
        password : dbConfig.password,
        connectString : dbConfig.connectString
    },
     function(err, connection){
        if(err)
        {
            
            console.error(err.message);
            return;
        }

        //var binds = [[req.body.username]]
        let query = "select * from ( select r.artist_name , a.art_name, a.image_url, a.art_id  from  artist r, art a, exhibition e where r.artist_id = a.artist_id AND a.exhibition_id = e.exhibition_id order by art_id desc ) where rownum <= 3 "
        connection.execute(query,
            
            async (err,result) =>
        {
            if(err)
            {
                console.error(err.message);
                
                return res.status(200).json({
                    success:false
                })
            }
            var strres = ""+ result.rows
            var array = strres.split(",")
            

            var jsondata = []

            if(result.rows != undefined)
            {
                result.rows.forEach((array) => {
                    var data = {
                        artist: array[0],
                        artwork: array[1],
                        imgUrl: array[2],
                        moreUrl:'#',
                        id : array[3]
                    
                    }
    
                    //console.log('\n')
    
    
                    jsondata.push(data)
                })

            }

            return res.json(jsondata)


        })

        connection.close();
    })

    
/*
   Imagedb.findAll({
        limit:3,
        order : [['id','DESC']]
   })
   .then((result) => {
    let result2 = [];
    for(let i=0; i< result.length; i++)
    {
        result2.push({
            artist: result[i].artist,
            artwork: result[i].artname,
            imgUrl: result[i].imageurl,
            moreUrl:'#'
        })
    }

       res.json(result2)
   })
   .catch( err => {throw err})
   */
});

    
app.get('/api/exhibition1/data', function (req, res) {
   

    oracledb.getConnection({
        user : dbConfig.user,
        password : dbConfig.password,
        connectString : dbConfig.connectString
    },
     function(err, connection){
        if(err)
        {
            
            console.error(err.message);
            return;
        }

        //var binds = [[req.body.username]]
        let query = "select * from ( select r.artist_id, r.artist_name , a.art_id, a.art_name, a.image_url, e.exhibition_id, e.exhibition_name  from  artist r, art a, exhibition e where r.artist_id = a.artist_id AND a.exhibition_id = e.exhibition_id order by art_id desc )"
        connection.execute(query,
            
            async (err,result) =>
        {
            if(err)
            {
                console.error(err.message);
                
                return res.status(200).json({
                    success:false
                })
            }
            var strres = ""+ result.rows
            var array = strres.split(",")
            

            var jsondata = []

            if(result.rows != undefined)
            {
                result.rows.forEach((array)=>{

                    var data = {
                        artist_id : array[0],
                        artist: array[1],
                        art_id:array[2],
                        artname: array[3],
                        imgUrl: array[4],
                        moreUrl:'#',
                        exhibition_id : array[5],
                        musium : array[6]
                        
                    }
    
                    //console.log('\n')
    
    
                    jsondata.push(data)
                })
            }

            return res.json(jsondata)


        })

        connection.close();
    })

    /*
    Imagedb.findAll({

    })
    .then((result) => {

        let result2 = [];
        for(let i=0; i< result.length; i++)
        {
            result2.push({
                artist: result[i].artist,
                artname: result[i].artname,
                imgUrl: result[i].imageurl,
                musium: result[i].exhibition
                
            })
        }

        res.json(result2)
    })
    .catch(err => {throw err})
    */
    
    });


    app.post('/api/exhibition2/exhibition', function (req, res) {

        if(req.body.exhibition != undefined && req.body.exhibition.length>=1)
        {
            oracledb.fetchAsString = [oracledb.CLOB]
            oracledb.getConnection({
                user : dbConfig.user,
                password : dbConfig.password,
                connectString : dbConfig.connectString
            },
             async function(err, connection){
                if(err)
                {
                    
                    console.error(err.message);
                    return;
                }

                let q = "select exhibition_name, exhibition_data from exhibition where exhibition_id = :1"
                let result2 = await connection.execute(q,[Number(req.body.exhibition)])
        
                //var binds = [[req.body.username]]
                let query = "select r.artist_name, e.exhibition_name, a.image_url, a.art_name, a.Art_id, e.Exhibition_data  from art a, artist r, exhibition e where e.exhibition_id = :id AND a.artist_id = r.artist_id and a.exhibition_id = e.exhibition_id  order by a.art_id desc"
                connection.execute(query,
                    {id : {dir: oracledb.BIND_IN, val : Number(req.body.exhibition), type : oracledb.NUMBER}},
                    async (err,result) =>
                {
                    if(err)
                    {
                        console.error(err.message);
                        
                        return res.status(200).json({
                            success:false
                        })
                    }
                    var jsondata = []
        
                    if(result.rows != undefined && result.rows.length>=1)
                    {
                        result.rows.forEach((rows,i) => {
                            var data = {
                                artist:rows[0],
                                day:'apr 10 - may 11, 2021',
                                musium: rows[1],
                                img:rows[2],
                                artworkUrl:'#',
                                textTitle: rows[3],
                                textArea: rows[5],
                                datenumber:351,
                                totalnumber:'194:36:41',
                                time:'2020. 02. 08 PM 14:00 기준'
                            
                            }
            
                            //console.log(data)
            
            
                            jsondata.push(data)
                        })
                    }
        
                    else
                    {
                        var data = {
                            artist:'작품 없음',
                            day:'apr 10 - may 11, 2021',
                            musium: result2.rows[0][0],
                            img:'notfoung.png',
                            artworkUrl:'#',
                            textTitle: '해당 전시관에 진행중인 내용이 없습니다',
                            textArea: result2.rows[0][1],
                            datenumber:351,
                            totalnumber:'194:36:41',
                            time:'2020. 02. 08 PM 14:00 기준'
                        
                        }

                        jsondata.push(data)
                    }


                    return res.json(jsondata)
        
        
                })
        
                connection.close();
            })

            /*
            Imagedb.findAll({
                where: {exhibition:req.body.exhibition}
            })
            .then((result)=>{

                let result2 = []

                for(let i=0; i<result.length;i++)
                {
                    result2.push({
                        rank:i+1,
                        art: result[i].artist+" : "+result[i].artname,
                        looktime:'194:36:41',
                        id:result[i].id
                    })
                }

                res.json(result2)
            })
            .catch((err)=>{
                res.json(err)
            })
            */
        }
        else{
            oracledb.getConnection({
                user : dbConfig.user,
                password : dbConfig.password,
                connectString : dbConfig.connectString
            },
             function(err, connection){
                if(err)
                {
                    
                    console.error(err.message);
                    return;
                }
        
                //var binds = [[req.body.username]]
                let query = "select * from (select r.artist_name, e.exhibition_name, a.image_url, a.art_name, a.Art_id  from art a, artist r, exhibition e where a.artist_id = r.artist_id and a.exhibition_id = e.exhibition_id  order by a.art_id desc ) where rownum <= 10"
                connection.execute(query,
                  
                    async (err,result) =>
                {
                    if(err)
                    {
                        console.error(err.message);
                        
                        return res.status(200).json({
                            success:false
                        })
                    }
                    var jsondata = []
        
                    if(result.rows != undefined)
                    {
                        result.rows.forEach((rows,i) => {
                            var data = {
                                artist:rows[0],
                                day:'apr 10 - may 11, 2021',
                                musium: rows[1],
                                img:rows[2],
                                artworkUrl:'#',
                                textTitle: rows[3],
                                textArea:' 을 위한 정책을 실시할 의무를 진다. 언론·출판에 대한 허가나 검열과 집회·결사에 대한 허가는 인정되지 아니한다. 학교교육 및 평생교육을 포함한 교육제도와 그 운영, 교육재정 및 교원의 지위에 관한 기본적인 사항은 법률로 정한다.신체장애자 및 질병·노령 기타의 사유로 생활능력이 없는 국민은 법률이 정하는 바에 의하여 국가의 보호를 받는다. 대통령은 제3항과 제4항의 사유를 지체없이 공포하여야 한다.원장은 국회의 동의를 얻어 대통령이 임명하고, 그 임기는 4년으로 하며, 1차에 한하여 중임할 수 있다. 모든 국민은 근로의 권리를 가진다. 국가는 사회적·경제적 방법으로 근로자의 고용의 증진과 적정임금의 보장에 노력하여야 하며, 법률이 정하는 바에 의하여 최저임금제를 시행하여야 한다.선거에 있어서 최고득표자가 2인 이상인 때에는 국회의 재적의원 과반수가 출석한 공개회의에서 다수표를 얻은 자를 당선자로 한다. 공무원의 신분과 정치적 중립성은 법률이 정하는 바에 의하여 보장된다.헌법재판소는 법관의 자격을 가진 9인의 재판관으로 구성하며, 재판관은 대통령이 임명한다. 국가는 과학기술의 혁신과 정보 및 인력의 개발을 통하여 국민경제의 발전에 노력하여야 한다.',
                                datenumber:351,
                                totalnumber:'194:36:41',
                                time:'2020. 02. 08 PM 14:00 기준'
                            
                            }
            
                            //console.log('\n')
            
            
                            jsondata.push(data)
                        })
                    }
        
                    return res.json(jsondata)
        
        
                })
        
                connection.close();
            })

        }

        /*
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
            */
        });

        app.post('/api/exhibition2/rank', function (req, res) {
            
            if(req.body.exhibition != undefined && req.body.exhibition.length>=1)
            {
                oracledb.getConnection({
                    user : dbConfig.user,
                    password : dbConfig.password,
                    connectString : dbConfig.connectString
                },
                 function(err, connection){
                    if(err)
                    {
                        
                        console.error(err.message);
                        return;
                    }
            
                    //var binds = [[req.body.username]]
                    let query = "select * from (select r.artist_name, a.art_name, a.Art_id  from art a, artist r, exhibition e where e.exhibition_id = :id AND a.artist_id = r.artist_id and a.exhibition_id = e.exhibition_id  order by a.art_id desc) where rownum <= 6"
                    connection.execute(query,
                        {id : {dir: oracledb.BIND_IN, val : Number(req.body.exhibition), type : oracledb.NUMBER}},
                        async (err,result) =>
                    {
                        if(err)
                        {
                            console.error(err.message);
                            
                            return res.status(200).json({
                                success:false
                            })
                        }
                        var jsondata = []
            
                        if(result.rows != undefined)
                        {
                            result.rows.forEach((rows,i) => {
                                var data = {
                                    rank:i+1,
                                    art: rows[0]+" : "+rows[1],
                                    looktime:'194:36:41',
                                    id:rows[2]
                                
                                }
                
                                //console.log('\n')
                
                
                                jsondata.push(data)
                            })
                        }
            
                        return res.json(jsondata)
            
            
                    })
            
                    connection.close();
                })

                /*
                Imagedb.findAll({
                    where: {exhibition:req.body.exhibition}
                })
                .then((result)=>{

                    let result2 = []

                    for(let i=0; i<result.length;i++)
                    {
                        result2.push({
                            rank:i+1,
                            art: result[i].artist+" : "+result[i].artname,
                            looktime:'194:36:41',
                            id:result[i].id
                        })
                    }

                    res.json(result2)
                })
                .catch((err)=>{
                    res.json(err)
                })
                */
            }
            else{
                oracledb.getConnection({
                    user : dbConfig.user,
                    password : dbConfig.password,
                    connectString : dbConfig.connectString
                },
                 function(err, connection){
                    if(err)
                    {
                        
                        console.error(err.message);
                        return;
                    }
            
                    //var binds = [[req.body.username]]
                    let query = "select * from (select r.artist_name, a.art_name, a.Art_id  from art a, artist r, exhibition e where a.artist_id = r.artist_id and a.exhibition_id = e.exhibition_id  order by a.art_id desc ) where rownum <= 6"
                    connection.execute(query,
                      
                        async (err,result) =>
                    {
                        if(err)
                        {
                            console.error(err.message);
                            
                            return res.status(200).json({
                                success:false
                            })
                        }
                        var jsondata = []
            
                        if(result.rows != undefined)
                        {
                            result.rows.forEach((rows,i) => {
                                var data = {
                                    rank:i+1,
                                    art: rows[0]+" : "+rows[1],
                                    looktime:'194:36:41',
                                    id:rows[2]
                                
                                }
                
                                //console.log('\n')
                
                
                                jsondata.push(data)
                            })
                        }
            
                        return res.json(jsondata)
            
            
                    })
            
                    connection.close();
                })

            }
            /*
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
                ])*/
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
        
                    app.post('/api/exhibition3/exhibition', function (req, res) {

                        var date = moment().format('YYYY-MM-DD HH:mm:ss');

                        if(req.body.id !=undefined && req.body.id.length>=1)
                        {



                            console.log("찾는 작품 번호 : "+Number(req.body.id))

                            oracledb.getConnection({
                                user : dbConfig.user,
                                password : dbConfig.password,
                                connectString : dbConfig.connectString
                            },
                             function(err, connection){
                                if(err)
                                {
                                    
                                    console.error(err.message);
                                    return;
                                }
                                
                                //var binds = [[req.body.username]]
                                let query = "select r.artist_name , a.art_name, a.image_type, TO_CHAR(a.release_date,'YYYY-MM-DD'), a.image_size, a.image_url, e.exhibition_name, e.exhibition_id, r.artist_id  from  artist r, art a, exhibition e where a.art_id = :id AND r.artist_id = a.artist_id AND a.exhibition_id = e.exhibition_id"
                                connection.execute(query,
                                    {id:{dir : oracledb.BIND_IN,val:Number(req.body.id), type:oracledb.NUMBER}},
                                    async (err,result) =>
                                {
                                    if(err)
                                    {
                                        console.error(err.message);
                                        
                                        return res.status(200).json({
                                            success:false
                                        })
                                    }
                                    var jsondata = []
                        
                                    if(result.rows != undefined)
                                    {
                                        result.rows.forEach((array) => {
                                            
                                            var data = {
                                                artist: array[0],
                                                artname: array[1],
                                                arttype: array[2],
                                                artsize: array[3]+", " +array[4],
                                                imgUrl: array[5],
                                                musium: array[6],
                                                people_number: 351,
                                                total_people_number: 9510,
                                                time : date +'기준',
                                                totaltime: '283:36:41',
                                                exhibition_id : array[7],
                                                artist_id : array[8]
                                            }
                            
                                            //console.log('\n')
                            
                            
                                            jsondata.push(data)
                                        })
                        
                                    }
                        
                                    return res.json(jsondata)
                        
                        
                                })
                        
                                connection.close();
                            })

                            /*
                            Imagedb.findOne({
                                where : {id:req.body.id}
                            })
                            .then((result) => {
                                
                                res.json([{
                                        artist: result.artist,
                                        artname: result.artname,
                                        arttype: result.imagetype,
                                        artsize: result.artrelease_date+", " +result.imagesize,
                                        imgUrl: result.imageurl,
                                        musium: result.exhibition,
                                        people_number: 351,
                                        total_people_number: 9510,
                                        time : date +'기준',
                                        totaltime: '283:36:41'
    
                                }])
    
                            })
                            .catch(err => {throw err})
                            */
                        }

                        else
                        {
                            oracledb.getConnection({
                                user : dbConfig.user,
                                password : dbConfig.password,
                                connectString : dbConfig.connectString
                            },
                             function(err, connection){
                                if(err)
                                {
                                    
                                    console.error(err.message);
                                    return;
                                }
                        
                                //var binds = [[req.body.username]]
                                let query = "select * from (select r.artist_name , a.art_name, a.image_type, TO_CHAR(a.release_date,'YYYY-MM-DD'), a.image_size, a.image_url, e.exhibition_name, e.exhibition_id, r.artist_id  from  artist r, art a, exhibition e where r.artist_id = a.artist_id AND a.exhibition_id = e.exhibition_id order by a.art_id desc) where rownum=1"
                                connection.execute(query,
                                    async (err,result) =>
                                {
                                    if(err)
                                    {
                                        console.error(err.message);
                                        
                                        return res.status(200).json({
                                            success:false
                                        })
                                    }
                                   
                                    var jsondata = []
                        
                                    if(result.rows != undefined)
                                    {
                                        result.rows.forEach((array) => {
                                            
                                            var data = {
                                                artist: array[0],
                                                artname: array[1],
                                                arttype: array[2],
                                                artsize: array[3]+", " +array[4],
                                                imgUrl: array[5],
                                                musium: array[6],
                                                people_number: 351,
                                                total_people_number: 9510,
                                                time : date +'기준',
                                                totaltime: '283:36:41',
                                                exhibition_id : array[7],
                                                artist_id : array[8]
                                            }
                            
                                            //console.log('\n')
                            
                            
                                            jsondata.push(data)
                                        })
                        
                                    }
                        
                                    return res.json(jsondata)
                        
                        
                                })
                        
                                connection.close();
                            })
                        }

                        
                       




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
                                              },
                                              {
                                                name: '20',
                                                'Day': 10,
                                              },
                                              {
                                                name: '21',
                                                'Day': 11,
                                              },
                                              {
                                                name: '22',
                                                'Day': 15,
                                              },
                                              {
                                                name: '23',
                                                'Day': 20,
                                              },
                                              {
                                                name: '24',
                                                'Day': 17,
                                              },
                                              {
                                                name: '25',
                                                'Day': 9,
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
                                                name: '7',
                                                'Day': 30,
                                              },
                                              {
                                                name: '8',
                                                'Day': 21,
                                              },
                                              {
                                                name: '9',
                                                'Day': 15,
                                              },
                                              {
                                                name: '10',
                                                'Day': 20,
                                              },
                                              {
                                                name: '11',
                                                'Day': 17,
                                              },
                                              
                                        ])
                                        break;

                                case 'year':
                                    res.json(
                                        [
                                            {
                                                name: '2019',
                                                'Day': 100,
                                              },
                                              {
                                                name: '2020',
                                                'Day': 121,
                                              },
                                              {
                                                name: '2021',
                                                'Day': 115,
                                              }
                                        ])
                            }

                           
                            });


                            app.get('/api/artist/img', function (req, res) {

                                /*
                                Imagedb.findAll()
                                .then((result) => {

                                    
                                    let result2 = [];

                                    for(let i=0; i< result.length; i++)
                                    {
                                        console.log("받아온 db : "+result[i])
                                        result2.push({
                                            imgUrl: result[i].imageurl
                                        })
                                    }
                                    res.json(result2)
                                    console.log("이미지 링크 : "+result2)
                                })
                                */
                                });

                                app.post('/api/artist01/slider', function (req, res) {
                                    oracledb.fetchAsString = [oracledb.CLOB]
                                    oracledb.getConnection({
                                        user : dbConfig.user,
                                        password : dbConfig.password,
                                        connectString : dbConfig.connectString
                                    },
                                    async function(err, connection){
                                        if(err)
                                        {
                                            console.error(err.message);
                                            
                                        }
                                        else{

                                            if(req.body.id !=undefined && req.body.id.length>=1)
                                            {
                                                var query = "select r.artist_name, a.image_type, a.image_size, e.exhibition_name, a.image_url, a.art_name, a.art_id from artist r, art a, exhibition e where e.exhibition_id = a.exhibition_id and a.artist_id = r.artist_id and r.artist_id = :id"

                                                var result = await connection.execute(query, {id : req.body.id})

                                                var jsondata = []

                                                if(result.rows !=undefined)
                                                {
                                                    result.rows.forEach((rows)=>{
                                                        jsondata.push({
                                                            artist: rows[0],
                                                            type: rows[1],
                                                            size:  rows[2],
                                                            musium:  rows[3],
                                                            imgUrl :  rows[4],
                                                            artname:  rows[5],
                                                            art_id:  rows[6]
                                                        })
                                                    })
                                                }
                                                res.json(jsondata)
                                                
                                            }
                                            
                                            else
                                            {
                                                var query = "select r.artist_name, a.image_type, a.image_size, e.exhibition_name, a.image_url, a.art_name, a.art_id from artist r, art a, exhibition e where e.exhibition_id = a.exhibition_id and a.artist_id = r.artist_id and r.artist_id IN (select e.artist_id from (select k.artist_id, COUNT(y.art_id) artnum from artist k, art y where y.artist_id = k.artist_id group by k.artist_id order by artnum desc) e where rownum=1) "

                                                var result = await connection.execute(query )

                                                var jsondata = []

                                                if(result.rows !=undefined)
                                                {
                                                    result.rows.forEach((rows)=>{
                                                        jsondata.push({
                                                            artist: rows[0],
                                                            type: rows[1],
                                                            size:  rows[2],
                                                            musium:  rows[3],
                                                            imgUrl :  rows[4],
                                                            artname:  rows[5],
                                                            art_id:  rows[6]
                                                        })
                                                    })
                                                }
                                                res.json(jsondata)
                                            }
                                           
                                        }
                                    })

                                    /*
                                    Imagedb.findAll()
                                    .then((result) => {
                                        let result2 = [];

                                        for(let i=0;i<result.length;i++)
                                        {
                                            result2.push({
                                                artist: result[i].artist,
                                                type:'Composition(painting)',
                                                size:'1933, Oil On Canvas, 150X150',
                                                musium: result[i].exhibition,
                                                imgUrl : result[i].imageurl,
                                                artname: result[i].artname,
                                                id: result[i].id
                                            })
                                        }

                                        res.json(result2)
                                        
                                    })
                                    */

                                    });
                                   
                                    app.post('/api/artist01/artist', function (req, res) {
                                        
                                        console.log("작가번호 : "+ req.body.id)

                                            oracledb.fetchAsString = [oracledb.CLOB]
                                            oracledb.getConnection({
                                                user : dbConfig.user,
                                                password : dbConfig.password,
                                                connectString : dbConfig.connectString
                                            },
                                            async function(err, connection){
                                                if(err)
                                                {
                                                    console.error(err.message);
                                                    
                                                }
                                                else{

                                                    if(req.body.id !=undefined && req.body.id.length>=1)
                                                    {
                                                        var query = "select artist_name, Artist_info from artist where artist_id = :id"

                                                        var result = await connection.execute(query, {id : req.body.id})
    
                                                        var jsondata = []
    
                                                        if(result.rows !=undefined)
                                                        {
                                                            result.rows.forEach((rows)=>{
                                                                jsondata.push({
                                                                    name: rows[0],
                                                                    btnUrl: '#',
                                                                    textArea: rows[1],
                                                                    people_num: '35121',
                                                                    totaltime: '1894:36:41',
                                                                    timeline: '2021년 7월 20일 15시 30분 기준',
                                                                    like: '60'
                                                                })
                                                            })
                                                        }
                                                        res.json(jsondata)
                                                        
                                                    }
                                                    
                                                    else
                                                    {
                                                        var query = "select t.artist_name, t.Artist_info from artist t where t.artist_id IN ( select e.artist_id from (select r.artist_id, COUNT(a.art_id) artnum from artist r, art a where r.artist_id = a.artist_id group by r.artist_id order by artnum desc) e where rownum=1)"

                                                        var result = await connection.execute(query)
    
                                                        var jsondata = []
    
                                                        if(result.rows !=undefined)
                                                        {
                                                            result.rows.forEach((rows)=>{
                                                                jsondata.push({
                                                                    name: rows[0],
                                                                    btnUrl: '#',
                                                                    textArea: rows[1],
                                                                    people_num: '35121',
                                                                    totaltime: '1894:36:41',
                                                                    timeline: '2021년 7월 20일 15시 30분 기준',
                                                                    like: '60'
                                                                })
                                                            })
                                                        }
                                                        res.json(jsondata)
                                                    }
                                                   
                                                }
                                            })


                                        /*
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
                                        */
                                    })

                                    app.get('/api/artwork/data', function (req, res) {
                                        /*
                                        Imagedb.findAll()
                                        .then((result)=>{


                                            let result2 = [];

                                            

                                            for(let i=0; i< result.length; i++)
                                            {
                                                console.log("받아온 db : "+result[i])
                                                result2.push({
                                                    img:  result[i].imageurl,
                                                    text: result[i].artist
                                                })
                                            }
                                            res.json(result2)
                                            console.log("이미지 링크 : "+result2)
                                        })
                                        .catch(() => {
                                            res.json({
                                                success:false
                                            });
                                        })
                                        */
                                        
                                        });



    app.post('/api/checkId', (req,res) => {

        if(req.body.username=='')
        {
            
            res.json({
                success:'null'
            })
        }


        oracledb.getConnection({
            user : dbConfig.user,
            password : dbConfig.password,
            connectString : dbConfig.connectString
        },
        function(err, connection){
            if(err)
            {
                console.error(err.message);
                return;
            }
    
            //var binds = [[req.body.username]]
            let query = "select username from artuser where username = :queryText";
            console.log("oracle질의 : "+query);
            connection.execute(query, {queryText : {dir : oracledb.BIND_IN, val : req.body.username, type: oracledb.STRING}}, function(err,result)
            {
                if(err)
                {
                    console.error(err.message);
                    doRelease(connection)
                    return;
                }

    
                if(result.rows!=undefined && result.rows[0] != undefined && result.rows[0][0] === req.body.username)
                {
                    console.log("이미 존재하는 아이디");
                    return res.json({
                        success:false
                    })
                }
                
         
                else
                {

                    console.log("사용가능한 아이디")

                    return res.status(200).json({
                          success:true
                     })
            
                    //.render('/api/checkAdmin',{
                    //    session : req.session
                    //})
                }
    
                
            })
    
            connection.close();
        })
    
        function doRelease(connection)
        {
            connection.release(
                function(err) {
                    if (err) {
                        console.error(err.message);
                    }
                });
        }


    })

    app.get('/api/checkAdmin', (req,res) => {
        //console.log("받아온 토큰 : "+req.body.user)
        //console.log(req.session)
        //console.log("현재 세션 : "+req.session.user.username)
        
        /*세션 로그인 파트*/
        if(req.session.user!=undefined && req.session.user.username != undefined  && req.session.user.username.length>=1)
        //오라클 작업시 id부분은 필요없어서 조건문에서 생략 // && req.session.user.id != undefined
        {
            const sessionID = req.sessionID;
            console.log('session id :', sessionID);
            console.log('이미 세션으로 로그인 확인')
            res.json({
                username:req.session.user.username,
                name: req.session.user.name,
                email: req.session.user.email,
                userrole: req.session.user.role,
                id:req.session.user.id,
                success:true
            })
        }
        else
        {
            // 세션 ID
            const sessionID = req.sessionID;
            console.log('session id :', sessionID);
            console.log(req.session.user)
            if( req.session.user!=undefined && req.session.user.username != undefined)
            {
                console.log('username :', req.session.user.username);
                console.log('username length :', req.session.user.username.length);
            }
            
            console.log('로그인 안됨')
            
            
            
            res.json({
                success:false
            })
        }

 
    
    })



app.post('/api/myPage', (req,res) => {

    console.log(req.session)
    console.log("현재 세션 : "+req.session.user.username)
    
    /*세션 로그인 파트*/
    if(req.session.user!=undefined && req.session.user.username != undefined && req.session.user.username.length>=1)
    {
        const sessionID = req.sessionID;
        console.log('session id :', sessionID);
        console.log('이미 세션으로 로그인 확인')
        res.json({
            username:req.session.user.username,
            name: req.session.user.name,
            email: req.session.user.email,
            userrole: req.session.user.role,
            success:true
        })
    }
    else
    {
        // 세션 ID
        const sessionID = req.sessionID;
        console.log('session id :', sessionID);
        console.log(req.session.user)
        console.log('로그인 안됨')
        
        
        
        res.json({
            success:false
        })
    }

})


app.post('/api/myPagefindUser', (req,res) => {
    if(req.body.username == '' || req.body.username == undefined || req.body.username==null)
    {
        return res.json({
           name: false
        })
    }

    oracledb.getConnection({
        user : dbConfig.user,
        password : dbConfig.password,
        connectString : dbConfig.connectString
    },
    function(err, connection){
        if(err)
        {
            console.error(err.message);
            return res.json({
                name: false
             })
        }

        var query = "select username, name, email from artuser where username = :use"
        var str = req.body.username.trim()
        connection.execute(query,
             {use : {dir : oracledb.BIND_IN, val : str, type : oracledb.STRING}},
             (err, result)=>
             {
                if(err)
                {
                    console.log(err)
                    return res.json({
                        name: false
                     })
                }

                
                else if(result.rows!=undefined && result.rows[0] != undefined){
                    //console.log(str)

                    var jsondata = []
                    result.rows.forEach((rows)=>{
                        var data ={
                            username: rows[0],
                            id : rows[0],
                            name : rows[1],
                            idCode : '1001',
                            email : rows[2]
                        }
                        //console.log(data)
                        return res.json(data)
                    })
                }

                else{
                    return res.json({
                        name: false
                    })
                }
             })
    })

    /*
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

    */
})

app.get('/api/Transfer/artdata',(req,res) => {
   
    

    //console.log("세션 : "+req.session.user)
    if(req.session.user!=undefined && req.session.user.username != undefined && req.session.user.username.length>=1)
    //&& req.session.user.id != undefined는 오라클에서 안쓰므로 username으로 바꿈
    {
            console.log('로그인 확인')
            
            oracledb.getConnection({
                user : dbConfig.user,
                password : dbConfig.password,
                connectString : dbConfig.connectString
            },
             function(err, connection){
        
                if(err)
                {
                    
                    console.error(err.message);
                    return;
                }
        
                //var binds = [[req.body.username]]
                let query = "SELECT R.Artist_name, A.Art_name,  TO_CHAR(A.Expired,'YYYY-MM-DD'), A.Art_id FROM  ART A, ARTIST R, AUCTION U WHERE A.owner_username = :queryText  AND A.Artist_id = R.Artist_id AND U.art_id = A.art_id"
                connection.execute(query, {queryText : {dir : oracledb.BIND_IN, val : req.session.user.username, type: oracledb.STRING}},
                    
                    async (err,result) =>
                {
                    if(err)
                    {
                        console.error(err.message);
                        doRelease(connection)
                        return res.status(200).json({
                            success:false
                        })
                    }
        
                    console.log(result.rows)
                    var jsondata = []
        
                    if(result.rows!=undefined)
                    {
                        result.rows.forEach((array) => {
                            var data = {
                                artist: array[0],
                                artname: array[1],
                                expired: array[2],
                                id : array[3]//art_id
                            }
        
                            jsondata.push(data)
                        })
                    }

                    //console.log(jsondata)
        
                    return res.json(jsondata)
        
                })
        
            })
        
                


            /*
            User.findOne({
                where : {id:req.session.user.id}
            })
            .then((result) => {
                Imagedb.findAll({
                    where: {owner: result.username}
                })
                .then((result2) => {
                    res.json(result2)
                    console.log(result2.length)
                })
            })
            */
        }
        else
        {
            // 세션 ID
            const sessionID = req.sessionID;
            console.log('session id :', sessionID);
            console.log(req.session.user)
            console.log('로그인 안됨')
            
            
            
            res.json({
                success:false
            })
        }

/*
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
        res.json({
            success:false,
            expire:true
        })
    }


*/
    
})


app.post('/api/Transfer/sendArt',(req,res) => {
    
    console.log(req.body.checkBoxValue + "\n" +req.body.username )
    var date = moment().format('YYYY-MM-DD');
    var input = []
    var query = "update art set owner_username = :1, expired = TO_DATE(:2, 'YYYY-MM-DD') where art_id = :3 "
    var option = {
        autoCommit: true,
            bindDefs: [
                { type: oracledb.STRING, maxSize : 30 },
                { type : oracledb.STRING, maxSize : 11},
                { type: oracledb.NUMBER }
                
            ]
    }

    for(let i=0; i< req.body.checkBoxValue.length ; i++)
    {
        //console.log(req.body.checkBoxValue[i])
        var data =[
            req.body.username,
            date,
            Number(req.body.checkBoxValue[i])
           
        ]
        //console.log(data)

        input.push(data)
        /*
        Imagedb.update({owner: req.body.username},{where : {id : req.body.checkBoxValue[i]}
        })
        .then(() => {
            console.log(i+'번쨰 성공')
        })
        .catch()
        */
        //Auctiondb.update({},{where:{artwork_id:req.body.checkBoxValue[i]}})
    }

   

    oracledb.getConnection({
        user : dbConfig.user,
        password : dbConfig.password,
        connectString : dbConfig.connectString
    },
     async function(err, connection){

        if(err)
        {
            
            console.error(err.message);
            
        }
        else{
            try{
            connection.executeMany(query,input, option, (err, result)=>{
                if(err)
                {
                    
                    console.error(err.message);
                    
                }

                console.log(input)
                //console.log("Result is ",result.rowsAffected)
                return res.json({
                    result: true
                })
                

            })
            
            }
            catch(err)
            {
                return res.json({
                    result:false,
                    //success:false
                })
            }

        }
    })

    
})

app.post('/api/AuctionMain/isStarted',(req,res)=>{

    oracledb.getConnection({
        user : dbConfig.user,
        password : dbConfig.password,
        connectString : dbConfig.connectString
    },
     async function(err, connection){

        if(err)
        {
            
            console.error(err.message);
            return res.json({
                err:err,
                //success:false
            })
        }

        var query = "select TO_CHAR(u.begin_point,'YYYY-MM-DD'), TO_CHAR(u.end_point,'YYYY-MM-DD') from art a, auction u where a.art_id = :id and a.art_id = u.art_id"
        connection.execute(query,
             {id : {dir : oracledb.BIND_IN, val : Number(req.body.art_id), type : oracledb.NUMBER}},
             (err, result) => {
                if(err)
                {
                    console.error(err.message);
                    return res.json({
                        err:err,
                        //success:false
                    })
                }

                var jsondata = []
                if(result.rows != undefined)
                {
                    result.rows.forEach((rows)=>{
                        var data= {
                            begin_point : rows[0],
                            end_point : rows[1]
                        }
                        console.log(data)

                        res.json(data)
                    })
                }

                

             })
        

    })


    /*
    console.log("찾는 auction id : "+req.body.artname)
    Auctiondb.findOne({
        where:{artname:req.body.artname}
    })
    .then((result)=>{
        res.json(result)
    })
    .catch((err)=>{
        res.json({
            err:err,
            //success:false
        })
    })
    */
})

app.get('/api/AuctionMain/picturedata', function (req, res) {

    oracledb.getConnection({
        user : dbConfig.user,
        password : dbConfig.password,
        connectString : dbConfig.connectString
    },
    async function(err, connection){

        if(err)
        {                
            console.error(err.message);
        }
        var query = "select a.Image_url, r.artist_name, a.art_name, a.image_size, a.image_type, a.krw_lower, a.krw_upper, a.usd_lower, a.usd_upper, a.art_id from (art a join artist r on a.artist_id = r.artist_id) join auction u on a.art_id = u.art_id where a.owner_username is null order by u.end_point desc"

                var result = await connection.execute(query)

                if(result.rows!=undefined)
                {
                    var jsondata = []
                    result.rows.forEach((rows)=>{
                        jsondata.push({
                            img: rows[0],
                            artist: rows[1],
                            artwork: rows[2],
                            size: rows[3],
                            year:"1973",
                            type: rows[4],
                            KRWpriceStart: rows[5],
                            KRWpriceEnd: rows[6],
                            USDpriceStart: rows[7],
                            USDpriceEnd: rows[8],
                            id: rows[9],
                            isauctioned:null
    
                        })

                    })

                    //console.log(jsondata)
                    return res.json(jsondata)
                }

    })

    /*
    Imagedb.findAll({
        where: jsondata
    })
    .then((result) => {
        let result2 = [];

        for(let i=0; i<result.length; i++)
        {
            result2.push({
                img: result[i].imageurl,
                artist: result[i].artist,
                artwork: result[i].artname,
                size: result[i].imagesize,
                year: result[i].artrelease_date,
                type: result[i].imagetype,
                KRWpriceStart: result[i].KRW_lower,
                KRWpriceEnd: result[i].KRW_upper,
                USDpriceStart: result[i].USD_lower,
                USDpriceEnd: result[i].USD_upper,
                id:result[i].id,
                isauctioned:result[i].isauctioned
            })
        }

        res.json(result2)
    })
    .catch((err) => {
        res.json({err:err})
    })
    */
});


app.post('/api/search_auction',(req,res)=>{
    

    
    console.log("하한 "+req.body.value)
    console.log("상한 " +req.body.value2)

    
        //json 합성하기
        let jsondata = {}

        jsondata.isauctioned='yes'

        

        oracledb.fetchAsString = [ oracledb.CLOB ]
        oracledb.getConnection({
            user : dbConfig.user,
            password : dbConfig.password,
            connectString : dbConfig.connectString
        },
        async function(err, connection){

            if(err)
            {                
                console.error(err.message);
            }

           
            
            if(req.body.num.length>=1)
            {
                var query = "select a.Image_url, r.artist_name, a.art_name, a.image_size, a.image_type, a.krw_lower, a.krw_upper, a.usd_lower, a.usd_upper, a.art_id from (art a join artist r on a.artist_id = r.artist_id) join auction u on a.art_id = u.art_id where a.art_id = :num and a.owner_username is null"

                var result = await connection.execute(query,{num : {dir : oracledb.BIND_IN, val :  Number(req.body.num), type: oracledb.NUMBER}})

                if(result.rows!=undefined)
                {
                    var jsondata = []
                    result.rows.forEach((rows)=>{
                        jsondata.push({
                            img: rows[0],
                            artist: rows[1],
                            artwork: rows[2],
                            size: rows[3],
                            year:"1973",
                            type: rows[4],
                            KRWpriceStart: rows[5],
                            KRWpriceEnd: rows[6],
                            USDpriceStart: rows[7],
                            USDpriceEnd: rows[8],
                            id: rows[9],
                            isauctioned:null
    
                        })

                    })

                    console.log(jsondata)
                    return res.json(jsondata)
                }
            }
            else{
                var query = "select a.Image_url, r.artist_name, a.art_name, a.image_size, a.image_type, a.krw_lower, a.krw_upper, a.usd_lower, a.usd_upper, a.art_id from (art a join artist r on a.artist_id = r.artist_id) join auction u on a.art_id = u.art_id where a.owner_username is null and a.krw_lower >= :lower and a.krw_upper <= :upper"
                var result
                if(req.body.artist != undefined && req.body.artist.length>=1 && req.body.artname != undefined && req.body.artname.length>=1)
                {
                    query = "select a.Image_url, r.artist_name, a.art_name, a.image_size, a.image_type, a.krw_lower, a.krw_upper, a.usd_lower, a.usd_upper, a.art_id from (art a join artist r on a.artist_id = r.artist_id) join auction u on a.art_id = u.art_id where a.owner_username is null and a.art_name like :artname AND r.artist_name like :artistname AND a.krw_lower >= :lower and a.krw_upper <= :upper"
                    result = await connection.execute(query,{ artname : req.body.artname+"%", artistname : req.body.artist+"%", lower : req.body.value, upper : req.body.value2})
                    if(result.rows!=undefined)
                    {
                        var jsondata = []
                        result.rows.forEach((rows)=>{
                            jsondata.push({
                                img: rows[0],
                                artist: rows[1],
                                artwork: rows[2],
                                size: rows[3],
                                year:"1973",
                                type: rows[4],
                                KRWpriceStart: rows[5],
                                KRWpriceEnd: rows[6],
                                USDpriceStart: rows[7],
                                USDpriceEnd: rows[8],
                                id: rows[9],
                                isauctioned:null
        
                            })

                        })

                         //console.log(jsondata)
                     return res.json(jsondata)
                    }

                }

                else if(req.body.artist != undefined && req.body.artist.length>=1 && req.body.artname.length<1)
                {
                    query = "select a.Image_url, r.artist_name, a.art_name, a.image_size, a.image_type, a.krw_lower, a.krw_upper, a.usd_lower, a.usd_upper, a.art_id from (art a join artist r on a.artist_id = r.artist_id) join auction u on a.art_id = u.art_id where a.owner_username is null and r.artist_name like :artistname AND a.krw_lower >= :lower and a.krw_upper <= :upper"
                    result = await connection.execute(query,{ artistname : req.body.artist+"%", lower : req.body.value, upper : req.body.value2})
                    if(result.rows!=undefined)
                    {
                        var jsondata = []
                        result.rows.forEach((rows)=>{
                            jsondata.push({
                                img: rows[0],
                                artist: rows[1],
                                artwork: rows[2],
                                size: rows[3],
                                year:"1973",
                                type: rows[4],
                                KRWpriceStart: rows[5],
                                KRWpriceEnd: rows[6],
                                USDpriceStart: rows[7],
                                USDpriceEnd: rows[8],
                                id: rows[9],
                                isauctioned:null
        
                            })

                        })

                         //console.log(jsondata)
                     return res.json(jsondata)
                    }
                }
                else if( req.body.artname != undefined && req.body.artname.length>=1 && req.body.artist.length<1)
                {
                    query = "select a.Image_url, r.artist_name, a.art_name, a.image_size, a.image_type, a.krw_lower, a.krw_upper, a.usd_lower, a.usd_upper, a.art_id from (art a join artist r on a.artist_id = r.artist_id) join auction u on a.art_id = u.art_id where a.owner_username is null and a.art_name like :artname AND a.krw_lower >= :lower and a.krw_upper <= :upper"
                    result = await connection.execute(query,{ artname : req.body.artname+"%", lower : req.body.value, upper : req.body.value2})
                    if(result.rows!=undefined)
                    {
                        var jsondata = []
                        result.rows.forEach((rows)=>{
                            jsondata.push({
                                img: rows[0],
                                artist: rows[1],
                                artwork: rows[2],
                                size: rows[3],
                                year:"1973",
                                type: rows[4],
                                KRWpriceStart: rows[5],
                                KRWpriceEnd: rows[6],
                                USDpriceStart: rows[7],
                                USDpriceEnd: rows[8],
                                id: rows[9],
                                isauctioned:null
        
                            })

                        })

                         //console.log(jsondata)
                     return res.json(jsondata)
                    }
                }
                else if(req.body.artname.length<1 && req.body.artist.length<1)
                {
                    console.log("case 3")
                    console.log(req.body.artist)
                    console.log(req.body.artname)
                    query = "select a.Image_url, r.artist_name, a.art_name, a.image_size, a.image_type, a.krw_lower, a.krw_upper, a.usd_lower, a.usd_upper, a.art_id from (art a join artist r on a.artist_id = r.artist_id) join auction u on a.art_id = u.art_id where a.owner_username is null and a.krw_lower >= :lower and a.krw_upper <= :upper"
                    result = await connection.execute(query,{ lower : req.body.value, upper : req.body.value2})

                    if(result.rows!=undefined)
                    {
                        var jsondata = []
                        result.rows.forEach((rows)=>{
                            jsondata.push({
                                img: rows[0],
                                artist: rows[1],
                                artwork: rows[2],
                                size: rows[3],
                                year:"1973",
                                type: rows[4],
                                KRWpriceStart: rows[5],
                                KRWpriceEnd: rows[6],
                                USDpriceStart: rows[7],
                                USDpriceEnd: rows[8],
                                id: rows[9],
                                isauctioned:null
        
                            })

                        })

                         //console.log(jsondata)
                     return res.json(jsondata)
                }
                }
            }

            
        })

         /*
        Imagedb.findAll({
            where : jsondata
        })
        .then((result) => {
            console.log("검사 완료 : "+result.length+" 개")
            let result2 = [];

            for(let i=0; i<result.length; i++)
            {
                result2.push({
                    img: result[i].imageurl,
                    artist: result[i].artist,
                    artwork: result[i].artname,
                    size:'300x260',
                    year:"1973",
                    type:'type1',
                    KRWpriceStart: result[i].KRW_lower,
                    KRWpriceEnd: result[i].KRW_upper,
                    USDpriceStart: result[i].USD_lower,
                    USDpriceEnd: result[i].USD_upper,
                    id:result[i].id,
                    isauctioned:result[i].isauctioned
                })
            }

            res.json(result2)
        })
        .catch((err) => {
            res.json({err:err})
        })

        */
    
})


app.post('/api/auctiondata',(req,res)=>{
    
    oracledb.fetchAsString = [ oracledb.CLOB ]
    oracledb.getConnection({
        user : dbConfig.user,
        password : dbConfig.password,
        connectString : dbConfig.connectString
    },
     async function(err, connection){

        if(err)
        {
            
            console.error(err.message);
        }

        var query = "select r.artist_name, a.art_name, a.image_size, a.image_type, a.krw_lower, a.krw_upper, a.usd_lower, a.usd_upper, a.Art_text, r.Artist_info, r.life_term, a.art_id, TO_CHAR(a.Release_date, 'YYYY-MM-DD'), r.artist_id, a.image_url from artist r, art a, auction u where a.art_id = :id and a.artist_id = r.artist_id and a.art_id = u.art_id and a.owner_username is null"

        connection.execute(query, 
            {id : {dir: oracledb.BIND_IN, val : Number(req.body.id), type : oracledb.NUMBER}},
            (err, result)=>
            {
                if(err)
                {
                    console.log(err)
                }

                else if(result.rows != undefined && result.rows[0]!=undefined)
                {
                    data = {
                        artist: result.rows[0][0],
                        artistyear: '',
                        artname: result.rows[0][1],
                        size: result.rows[0][2],
                        year:"",
                        imagesize: 100,
                        type: result.rows[0][3],
                        KRW_lower: result.rows[0][4],
                        KRW_upper: result.rows[0][5],
                        nowprice: result.rows[0][6],
                        enddate: result.rows[0][7],
                        arttext: result.rows[0][8],
                        artist_info: result.rows[0][9],
                        artistyearInfo: result.rows[0][10],
                        art_id : result.rows[0][11],
                        artrelease_date : result.rows[0][12],
                        artist_id : result.rows[0][13],
                        imageurl : result.rows[0][14]
                    }
                   // console.log(data)
                    return res.json(data)
                }
                else{
                    return res.json(null)
                }

            })
    })

/*
    Imagedb.findOne({
        where:{
            id:req.body.id,
            owner:null,
            isauctioned:'yes'
            }
    })
    .then((result) => {
        res.json(result)
    })
    .catch((err)=>{
        res.json(err)
    })

    */
})

app.post('/api/auctiondata/search',(req,res)=>{

    oracledb.getConnection({
        user : dbConfig.user,
        password : dbConfig.password,
        connectString : dbConfig.connectString
    },
     async function(err, connection){

        if(err)
        {
            
            console.error(err.message);
            return;
        }

        var query = "select * from (select r.username, u.user_price, u.bid_date, r.email from artuser r, user_bid u where r.username = u.username and u.art_id = :id order by u.user_price desc) where rownum <= 5"

        connection.execute(query,{id : req.body.id},(err, result)=>
        {

            if(err)
            {
                console.log(err)
            }

            if(result.rows != undefined && result.rows.length >= 1)
            {
                var jsondata = []
                result.rows.forEach((rows)=>{
                    jsondata.push({
                        username : rows[0],
                        userprice : rows[1],
                        updateDate : rows[2]

                    })
                })

                res.json({
                    success: true,
                    email : result.rows[0][3],
                    result : jsondata
                })
            }
            else{
                res.json({
                    success: false
                })
            }

        })

    })

/*   
    User_dib_db.findAll({
        where:{artwork_id:req.body.id},
        order:[['userprice','DESC']],
        limit:5
    })
    .then(async (result)=>{
        console.log('찾기 성공 : '+result)
        
        //result.success=true
        let jsondata={}
        if(result!=null)
        {
            jsondata.result = result
            jsondata.success = true

            //가장 높은 사람의 이메일 찾기
            //그냥 쓰면 비동기로 보내기 떄문에 async await 필요
            user_result = await User.findOne({
                where:{id:result[0].userid}
            })
           
                if(user_result!=null)
                {
                    jsondata.email = user_result.email
                    console.log('jsondata.email inside : '+jsondata.email)
                } 
            
        }
        else{
            jsondata.success =false
        }
        
        
        console.log('jsondata.email outside : '+jsondata.email)
        res.json(jsondata)
    })
    .catch((err)=>{
        console.log('찾기 실패 : '+err)
        //err.success=false
        
        res.json({
            err:err,
            success:false
        })
    })

*/
})

app.post('/api/auctiondata/submit',(req,res)=>{
    console.log(req.body.updateDate)
    console.log(req.body.userprice)
    console.log(req.body.username)
    console.log(req.body.art_id)

    
    oracledb.getConnection({
        user : dbConfig.user,
        password : dbConfig.password,
        connectString : dbConfig.connectString
    },
     async function(err, connection){

        if(err)
        {
            console.error(err.message);
        }

        var query = "select user_price from user_bid where art_id = :id order by user_price desc"
        var result = await connection.execute(query,{id : {dir : oracledb.BIND_IN, val : Number(req.body.art_id), type: oracledb.NUMBER}})

        console.log(result.rows)

        if(result.rows[0]==undefined || result.rows[0][0] < req.body.userprice)
        {

            query = "select * from user_bid where username = :id and art_id = :art"

            result = await connection.execute(query,{id: req.body.username, art:req.body.art_id})

            if(result.rows != undefined && result.rows.length>0)
            {
                query = "update user_bid set user_price = :1, bid_date = TO_DATE(:2,'YYYY-MM-DD')  where username = :3 and art_id = :4"
               
                try{
                    
                    var result2 = await connection.execute(query,[req.body.userprice, req.body.updateDate, req.body.username, req.body.art_id])
                
                        if(result2.rowsAffected>=1)
                        {
                            connection.commit()
                            res.json({success : true})
                        }
                        else{
                            connection.rollback()
                            res.json({err : true})
                        }
                    }catch(err)
                    {
                        connection.rollback()
                        console.log(err)
                        res.json({err : true})
                    }
                            
                        

            

            }
            else{
                query = "insert into user_bid values (:1, :2, TO_DATE(:3, 'YYYY-MM-DD'), :4)"
                connection.execute(query,[req.body.username, req.body.userprice, req.body.updateDate, req.body.art_id],
                    (err,result)=>{
                        if(err)
                        {
                            connection.rollback()
                            console.log(err)
                            res.json({err : true})
                        }

                        else if(result.rowsAffected>=1)
                        {
                            connection.commit()
                            res.json({success : true})
                        }
                        else{
                            connection.rollback()
                            res.json({err : true})
                        }
                    })
                


            }

        }
        else{
            res.json({err : true})
        }
    })

    /*
    //가장 높은 가격 제시한 것 찾기
    User_dib_db.findOne({
        order:[['userprice','DESC']],
        where:{
            artwork_id:req.body.artwork_id
        }
    })
    .then((first_res)=>{

        if(first_res==null)
            {
                console.log('첫번째 경매등록')
                User_dib_db.create(req.body)
                .then((result)=>{
                return  res.json({
                        success:true
                    })
                })
                .catch((err)=>{
                return res.json({
                        success:false,
                        err:err
                    })
                })
            }


        else{
            User_dib_db.findOne({
                where:{
                    userid:req.body.userid,
                    artwork_id:req.body.artwork_id
                }
            })
            .then((result)=>{
                
        
                //현재가보다 높은 가격 제시했을 떄
                if(first_res.userprice < req.body.userprice)
                {
                    if(result!=null)
                    {
                        console.log('데이터 업데이트')
                        User_dib_db.update(req.body,{
                            where:{
                                userid:req.body.userid,
                                artwork_id:req.body.artwork_id
                            }
                        })
                       .then((result2) => {
                            res.json({
                                success:true
                            })
                       })
                       .catch(()=>{
                            res.json({
                                success:false,
                                err:err
                            })
                        
                       })
                    }
                    else{
                        console.log('db에 기존에 없고\n 최고가보다 높은 가격의 경우 생성')
                        User_dib_db.create(req.body)
                        .then((result)=>{
                        return  res.json({
                                success:true
                            })
                        })
                        .catch((err)=>{
                        return res.json({
                                success:false,
                                err:err
                            })
                        })
                    }
    
                   
                
                }
        
                else{
                    res.json({
                        success:false
                    })
                }
            })
            .catch(()=>{
                
                {
                    return res.json({
                        success:false
                    })
                }
            })

            
        }


    
        
    })

    .catch((err)=>{
        
        console.log('catch문 기존 db에 없을 시 생성')
            User_dib_db.create(req.body)
            .then((result)=>{
              return  res.json({
                    success:true
                })
            })
            .catch((err)=>{
               return res.json({
                    success:false,
                    err:err
                })
            })
    })


*/

})

app.post('/api/auctiondata/isStarted',(req,res)=>{
    console.log("찾는 auction id : "+req.body.artname)

    oracledb.getConnection({
        user : dbConfig.user,
        password : dbConfig.password,
        connectString : dbConfig.connectString
    },
     async function(err, connection){

        if(err)
        {
            console.error(err.message);
            return;
        }

        var query = "select TO_CHAR(begin_point,'YYYY-MM-DD'), TO_CHAR(end_point,'YYYY-MM-DD'), Auction_unit  from auction u where art_id = :id"

        connection.execute(query,{id : req.body.artname}, (err, result)=>{
            if(err)
            {
                console.log(err)
            }
            else if(result.rows!=undefined)
            {
                res.json({
                    begin_point : result.rows[0][0],
                    end_point : result.rows[0][1],
                    auction_unit : result.rows[0][2]
                })
            }
        })
    })

    /*
    Auctiondb.findOne({
        where:{artname:req.body.artname}
    })
    .then((result)=>{
      
    

        res.json(result)
    })
    .catch((err)=>{
        res.json({
            err:err,
            //success:false
        })
    })
    */
})

app.post('/api/auctiondata/artist',(req,res)=>{
    console.log("찾는 작가명 : "+req.body.artist)

    
    /*
    Artistdb.findOne({
        where:{artist:req.body.artist}
    })
    .then((result)=>{
      
       
        res.json(result)
    })
    .catch((err)=>{
        res.json({
            err:err,
            //success:false
        })
    })
    */
})


app.post('/api/myauction', (req,res)=>{

    var jsondata = []

    oracledb.getConnection({
        user : dbConfig.user,
        password : dbConfig.password,
        connectString : dbConfig.connectString
    },
     async function(err, connection){

        if(err)
        {
            
            console.error(err.message);
            return;
        }

        //var binds = [[req.body.username]]
        let query = "SELECT A.art_id, A.Art_name, R.Artist_name, TO_CHAR(U.End_point,'YYYY-MM-DD'), A.Owner_username FROM USER_BID S, ART A, ARTIST R, AUCTION U WHERE S.username = :queryText AND S.art_id = A.art_id AND A.Artist_id = R.Artist_id AND U.art_id = A.art_id AND A.owner_username IS null"
        var result = await connection.execute(query, {queryText : {dir : oracledb.BIND_IN, val : req.body.username, type: oracledb.STRING}})
        

        if(result.rows.length<1)
        {
            console.log('존재하지 않습니다.')
            res.json({
                //auction:user_auctiondata
            })
        }
        else if(result.rows!=undefined)
            {
                result.rows.forEach((array) => {
                    var data = {
                        artwork_id: array[0],
                        artname: array[1],
                        artist: array[2],
                        end_point: array[3],
                        owner_id:array[4],
                        isfirst:null
                    }

                    jsondata.push(data)
                })
            



            // console.log("이전\n"+jsondata)
            var jsize = jsondata.length-1
            var jsondata2 = []

                jsondata.forEach(async(item, index) =>{
                    
                    query = "SELECT U.Username FROM USER_BID U WHERE U.Art_id = :artid AND U.User_price IN( SELECT DISTINCT MAX(S.User_price) FROM USER_BID S WHERE S.Art_id = U.Art_id)";
                    var result2 = await connection.execute(query, {
                        artid : {dir : oracledb.BIND_IN, val : Number(item.artwork_id), type: oracledb.NUMBER}    
                    })

                    if(result2.rows != undefined)
                    {
                        result2.rows.forEach((rows)=>{
                            //console.log("row[0] : "+rows[0])
                            //console.log("username : "+req.body.username)
                            //console.log("artname : "+item.artname)
                            
                            if(rows[0] === req.body.username)
                            {
                                //console.log("일치")
                                item.isfirst = 'yes'
                                //item.replace("isfirst",'yes')

                                //console.log("isfirst : "+item.isfirst)
                            } 
                        })
                    }

                    

                    var data2 = {
                        artwork_id: item.artwork_id,
                        artname: item.artname,
                        artist: item.artist,
                        end_point: item.end_point,
                        owner_id: item.owner_id,
                        isfirst: item.isfirst
                    }
                    //console.log(jsize+", "+index+", "+data2)
                    jsondata2.push(data2)
                    

                    if(index == jsize)
                    {
                    // console.log("jsondata2 : "+jsondata2)
                        res.json({
                            dib:jsondata2,
                            //auction:user_auctiondata
                        })
                    }
                })
            }


        //console.log("??? jsondata2 : "+jsondata2)

    })
    

})


app.post('/api/auctiondata/findbyid',(req,res)=>{
    console.log("찾는 auction id : "+req.body.artwork_id)
    Auctiondb.findOne({
        where:{artwork_id:req.body.artwork_id}
    })
    .then(async (result)=>{
      
        let jsondata = {
            artist:result.artist,
            artname:result.artname,
            end_point:result.end_point,
            artwork_id:result.artwork_id,
            auction_unit:result.auction_unit,
            owner_id: result.owner_id
        }

        dib_result = await User_dib_db.findOne({
            order : [['userprice','DESC']],
            where:{artwork_id:result.artwork_id}
        })
            
            if(dib_result.userid==req.body.my_id)
            {
                jsondata.isfirst='yes'   
                
            }

            console.log('isfirst : '+jsondata.isfirst+'\n\n')
            res.json(jsondata)

       

        
    })
    .catch((err)=>{
        res.json({
            err:err,
            //success:false
        })
    })
})

app.post('/api/auction_submit',(req,res)=>{
    
    oracledb.getConnection({
        user : dbConfig.user,
        password : dbConfig.password,
        connectString : dbConfig.connectString
    },
     async function(err, connection){

        if(err)
        {
            console.error(err.message);
        }
        else{

            var query = "update art set owner_username = :1, expired = :2 where art_id = :3"
            connection.execute(query,[
                req.body.username,
                req.body.date,
                req.body.art_id
            ],(err,result)=>{
                if(err)
                {
                    console.log(err)
                }
                else if(result.rowsAffected>=1)
                {
                    res.json({
                        success:true
                    })
                }
            })
            connection.commit()
        }
     })

     /*
    Auctiondb.update({
        owner_id : req.body.id
    },
    {
        where:{artwork_id: req.body.artwork_id }
    })
    .then(()=>{
       

        Imagedb.update({
            owner:req.body.username,
            expired:  req.body.date
        },
        {
            where:{id: req.body.artwork_id }
        })
        .then(()=>{
            res.json({
                success:true
            })
        })
        .catch((err)=>{
            res.json({err:err})
        })
        
    })
    .catch((err)=>{
        res.json({err:err})
    })
    */
})

app.post('/api/deleteuser',(req,res)=>{

    req.session.destroy()

    oracledb.getConnection({
        user : dbConfig.user,
        password : dbConfig.password,
        connectString : dbConfig.connectString
    },
     async function(err, connection){

        if(err)
        {
            console.error(err.message);
        }
        else{
            
            
            var query = "delete from user_bid where username = :1"
            var result = connection.execute(query, [req.body.username])

            query = "update art set owner_username = '', expired = '' where owner_username = :1"
            result = connection.execute(query, [req.body.username])

            query = "delete from artuser where username = :1"
            result = connection.execute(query, [req.body.username])

            if(result.rowsAffected<0)
            {
                connection.rollback()
                res.json({success: false})
            }

            else
            {
                connection.commit()

                res.json({success: true})
            }
           
        }
    })

})

app.post('/api/mainsearch',(req,res)=>{

    console.log(req.body.check)

    oracledb.getConnection({
        user : dbConfig.user,
        password : dbConfig.password,
        connectString : dbConfig.connectString
    },
     async function(err, connection){

        if(err)
        {
            console.error(err.message);
        }
        else{
            var query
            if(req.body.check==1)
            {
                query = "select art_id from art where art_name like :val"
            }
            
            else if(req.body.check==2)
            {
                query = "select artist_id from artist where artist_name like :val"
            }

            else if(req.body.check==3)
            {
                query = "select exhibition_id from exhibition where exhibition_name like :val"
            }
            console.log(query)
            
            var result = await connection.execute(query, {val : req.body.name+"%"})

          
            if(result.rows != undefined && result.rows[0]!=undefined)
            {
                res.json({
                    id:result.rows[0][0]
                })
            }
            else{
                res.json({
                    err:true
                })
            }
            
           
        }
    })

})



app.listen(PORT, () => {
    console.log(`Server run: http://localhost:${PORT}/`)
})