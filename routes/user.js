var express = require('express');
var multer = require('multer')
var nodemailer = require('nodemailer');
var router = express.Router();
const { login, getRandom, adminlogin, getdel, updateuser, updateimg, forget} = require('../controller/user')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const {con, escape} = require('../db/mysql')
const { genPassword } = require('../utils/cryp')
const loginCheck = require('../middleware/loginCheck')
//登录
router.post('/login', function(req, res, next) {
    const result = login(req.body.username, req.body.password)
    //console.log(result)
    return result.then(data => {
        if (data.username) {
            // 设置 session
            req.session.username = data.username
            req.session.realname = data.realname
            console.log(req.session.realname)
            res.json(
                new SuccessModel(data)
            )
            return
        }
        res.json(
            new ErrorModel('登录失败')
        )
    })
});
//管理员登录
router.post('/admin',(req, res, next) =>{
    const result = adminlogin(req.body.username, req.body.password)
    return result.then(data =>{
        if(data.username){
            req.session.username = data.username
            req.session.realname = data.realname
            console.log(req.session.realname)
            res.json(
                new SuccessModel(data)
            )
            return
        }
        res.json(
            new ErrorModel('登录失败')
        )
    })
}) 
//注册
router.post('/register', function(req, res) {
    const sql = `
        select username from user where username='${req.body.username}'
    `
    const id = getRandom()
    const realname = req.body.username
    let imgurl = "http://localhost:8000/"
    let path = 'public\\images\\1584682741567header.jpg'
    path = path.replace(/\\/g,'\\\\')
    imgurl = imgurl + path
    //const password = genPassword(req.body.password)
    //password = escape(password)
    //console.log(password)
    const sql1 = `INSERT INTO user(user_id, username, password, realname,imgurl,email) 
    VALUES ('${id}','${req.body.username}','${req.body.password}','${realname}','${imgurl}','${req.body.email}')
   
    `
    con.query(sql,(err,data) => {
        if(data.length > 0){
            res.send(new ErrorModel('用户已存在,请重新注册'))
        }else{
            con.query(sql1,(err,data) =>{
                res.send(new SuccessModel(data))
            })
        }
    })
});
//注销用户
router.post('/deluser',loginCheck, (req, res, next) =>{
    const result = getdel(req.body.id)
    return result.then(data => {
        res.json(new SuccessModel())
    })
})
//修改用户
router.post('/update',loginCheck, (req, res, next) => {
    const result = updateuser(req.body.id,req.body.username,req.body.password)
    return result.then(data => {
        res.json(new SuccessModel())
    })
})
//上传用户头像
var storage = multer.diskStorage(
    {destination: function (req, file, cb){
        cb(null, './public/images')
    },
    filename: function(req,file,cb){
        var fileFormat = (file.originalname).split(".");
        cb(null,file.fieldname + '-' + Date.now() + "." + fileFormat[fileFormat.length - 1])
       }
    }
);
var upload = multer({storage: storage}).any();
router.post('/img',upload,function(req, res, next) {
    console.log(req.files)
    var newname = 'http://localhost:8000/' + req.files[0].path
    var id = req.session.username
    const result = updateimg(id,newname)
    return result.then(data => {
        res.json(new SuccessModel(data))
    })
})
//忘记密码
router.post('/forget',(req, res, next) => {
    const result = forget(req.body.username)
    return result.then(data =>{
        if(data.length <= 0 ){
            res.json(new ErrorModel('该账号还未注册，请重新输入！'))
        }else{
            res.json(new SuccessModel(data))
        }
        
    })
})
//发送邮件
var mailTransport = nodemailer.createTransport({
    host : 'smtp.qq.com',
    secureConnection: true, // 使用SSL方式（安全方式，防止被窃取信息）
    auth : {
        user : '1083477542@qq.com',
        pass : 'ynvotdanmxqvjdig'
    },
  });
  router.post('/sendemail', function(req, res, next) {
      console.log(req.body.email,req.body.username,req.body.password)
    var options = {
        from        : '1083477542@qq.com',
        to          : req.body.email,
        subject        : '一封来自趣玩游戏论坛的邮件',
        text          : '一封来自趣玩游戏论坛的邮件',
        html           : '<h1>您好，您在趣玩游戏论坛的账号'+req.body.username+'的密码为'+req.body.password+'</h1>'
    };
    
    mailTransport.sendMail(options, function(err, msg){
        if(err){
            console.log(err);
            res.render('index', { title: err });
        }
        else {
            console.log(msg);
            res.render('index', { title: "已接收："+msg.accepted});
        }
    });
  });
  
module.exports = router