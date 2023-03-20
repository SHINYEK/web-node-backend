var express = require('express');
var router = express.Router();
var db = require('../db');
var multer = require('multer');

var upload = multer({
  storage:multer.diskStorage({
    destination:(req,file,done)=>{
      done(null,'./public/photos')
    },
    filename:(req,file,done)=>{
      done(null,Date.now()+'_'+file.originalname)
    }
  })
})

//유저목록
router.get('/', function(req, res, next) {
  var sql = 'select *, date_format(join_date,"%Y-%m-%d %T") fmt_date from users order by join_date desc'
  db.get().query(sql,function(err,rows){
    res.send(rows);
  })
});


//특정 아이디의 사용자 정보
router.get('/:uid',function(req,res){
  var uid = req.params.uid;
  var sql = "select *, date_format(join_date,'%Y-%m-%d %T') fmt_date from users where uid=?";
  db.get().query(sql,[uid],function(err,rows){
    res.send(rows[0]);
  })
})

//로그인
router.post('/login',function(req,res,next){
  var uid = req.body.uid;
  var upass = req.body.upass;
  var sql = 'select * from users where uid=?';
  db.get().query(sql,[uid],function(err,rows){
    var result = 0;
    if(rows[0]){
      if(rows[0].upass == upass){
        result = 1;
      }else{
        result = 2;
      }
    } 
    res.send({result:result})
  })
})

//사용자등록
router.post('/insert',upload.single('file'),function(req,res){
  var uid = req.body.uid;
  var upass = req.body.upass;
  var uname= req.body.uname;
  var address = req.body.address;
  var phone = req.body.phone;
  var photo = "";
  if(req.file !=null) photo = '/photos/'+req.file.filename;
  console.log('....photo',photo)
  var sql = "insert into users(uid,upass,uname,address,phone,photo) values(?,?,?,?,?,?)";
  db.get().query(sql,[uid,upass,uname,address,phone,photo],function(err,rows){
    console.log(err,'err.....')
    res.sendStatus(200);
  })
})

//사용자 정보 수정
router.post('/update',upload.single('file'),function(req,res){
  var uid = req.body.uid;
  var upass = req.body.upass;
  var uname= req.body.uname;
  var address = req.body.address;
  var phone = req.body.phone;
  var photo = req.body.photo;
  if(req.file !=null) photo = '/photos/'+req.file.filename;
  console.log('....photo',photo)
  var sql = "update users set upass=? , uname=?, address=? , phone =?, photo =? where uid = ?";
  db.get().query(sql,[upass,uname,address,phone,photo,uid],function(err,rows){
    console.log(err,'err.....')
    res.sendStatus(200);
  })
})

module.exports = router;
