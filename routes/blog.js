var express = require('express');
var formidable = require("formidable");  
var multer = require('multer')
const path = require('path');
const fs = require('fs');
var router = express.Router();
const {
    getList,
    getDetail,
    newBlog,
    updateBlog,
    delBlog,
    getHot,
    getComposite,
    getComment,
    newComment,
    getCollect,
    getUser,
    getUpdatauser,
    getReply,
    getUsers,
    getTSID,
    getText,
    getTSIDS,
    getLike,
    updatePoint,
    deleleBlog,
    updateClick,
    updatecomment,
    deleleTSID,
    getLikes,
    getShop,
    getGoods,
    getGoodes,
    getInsetgoods,
    getupdateTSID,
    getInsetTs,
    getUpoint,
    getUserInfo,
    setUserInfo,
    delgoods,
    getcollect,
    selectlikes
} = require('../controller/blog')
const {con} = require('../db/mysql')
const { SuccessModel, ErrorModel } = require('../model/resModel')
const loginCheck = require('../middleware/loginCheck')

//首页推荐
router.get('/recommends', (req, res, next) => {
    const result = getHot(req.query.index)
    //console.log(req.query.index)
    return result.then(recommendsData => {
        res.json(
            new SuccessModel(recommendsData)
        )
    })
});
//版块信息
router.get('/composite', (req, res, next) => {
    const result = getComposite(req.query.id)
    return result.then(compositeData => {
        res.json(
            new SuccessModel(compositeData)
        )
    })
});
//获取个人信息
router.get('/user', loginCheck,(req, res, next) => {
    const result = getUser(req.query.keyword)
    return result.then(userdata => {
        res.json(
            new SuccessModel(userdata)
        )
    })
})
//修改个人信息
router.post('/updateuser', loginCheck,(req, res, next) => {
    const result = getUpdatauser(req.body.id, req.body.name,req.body.signature
        ,req.body.sex,req.body.age, req.body.address,req.body.vocation)
    return result.then(data => {
            res.json(
                new SuccessModel(data)
            )
       con.query(`UPDATE blogs SET author='${req.body.name}'
        WHERE user_id='${req.body.id}'`)
    })
})
//查看帖子列表
router.get('/list', (req, res, next) => {
    //console.log(req.query.keyword)
    const result = getList(req.query.keyword)
    return result.then(listData => {
        res.json(
            new SuccessModel(listData)
        )
    })
});
//查看收藏的贴子
router.get('/collect', loginCheck, (req, res, next) => {
    console.log(req.query.id)
    const result = getCollect(req.query.id)
    return result.then(collectData => {
        res.json(
            new SuccessModel(collectData)
        )
    })
});
//查看帖子详情
router.get('/detail', (req, res, next) => {
    const result = getDetail(req.query.id)
    console.log(req.query.id)
    return result.then(data => {
        res.json(
            new SuccessModel(data)
        )
    })
});
//查看帖子评论
router.get('/comment',(req, res, next) => {
    const id = req.query.id
    const result = getComment(id)
    return result.then(data => {
        res.json(new SuccessModel(data))
    })
})
//查看板块分类
router.get('/reply',(req, res, next) => {
    const result = getReply()
    return result.then(data => {
        res.json(new SuccessModel(data))
    })
})
//发布帖子评论
router.post('/newcomment', loginCheck, (req, res, next) => {
    //console.log(req.body.userId)
  const result = newComment(req.body.userId, req.body.value,  req.body.uname, req.body.id)
     return result.then(data => {
        res.json(new SuccessModel(data))
    }) 

    return
})
//发布新帖子
router.post('/new', loginCheck, (req, res, next) => {
   /*  req.query.author = req.session.username */
    const result = newBlog(req.body.Sname, req.body.title, req.body.content, req.body.author, req.body.TSID, req.body.userId)
    return result.then(data => {
        res.json(
            new SuccessModel(data)
        )
    })
})
//编辑修改贴子
router.post('/update', loginCheck,(req, res, next) => {
    console.log(req.body.Sname)
    const result = updateBlog(req.body.topic_id,req.body.Sname,req.body.title,req.body.content,req.body.TSID)
    return result.then(data => {
            res.json(
                new SuccessModel(data)
            )
    })
})
//删除收藏贴子
router.post('/del', loginCheck, (req, res, next) => {
    const result = delBlog(req.body.id, req.body.userId)
    return result.then(val => {
        if (val) {
            res.json(
                new SuccessModel()
            )
        } else {
            res.json(
                new ErrorModel('删除博客失败')
            )
        }
    })
})
//删除收藏贴子
router.post('/delete', loginCheck, (req, res, next) => {
    const result = deleleBlog(req.body.id)
    return result.then(val => {
        if (val) {
            res.json(
                new SuccessModel()
            )
        } else {
            res.json(
                new ErrorModel('删除博客失败')
            )
        }
    })
})
//更新贴子点击量
router.get('/updateClick', (req, res, next) => {
    const result = updateClick(req.query.id,req.query.num)
    return result.then(data => {
            res.json(
                new SuccessModel(data)
            )
    })
})
//查询是否收藏
router.post('/getcollect', (req, res, next) => {
    //console.log(req.query.id,req.query.topic_id)
    const result = getcollect(req.body.id, req.body.topic_id)
    return result.then(data => {
        if(data.length > 0){
            res.json(new SuccessModel(data))
        }else{
            res.json(new ErrorModel(data))
        }
        
    })
})
//更新贴子收藏量
router.post('/updateReply', (req, res, next) => {
    const sql = `UPDATE blogs SET TReplyCount='${req.body.num}' WHERE id='${req.body.id}'`
    con.query(sql,  ((err,data) => {
        if(err){
            throw err
        }
         res.send(new SuccessModel())
        })
    ) 
})
//将文章加入到用户的收藏列表
router.post('/updateReply1', loginCheck, (req, res, next) => {
    console.log(req.body)
    const sql = `INSERT INTO collect (user_id, topic_id, title) VALUES 
    ('${req.body.user_id}', '${req.body.id}','${req.body.title}')`
    con.query(sql,  ((err,data) => {
        if(err){
            throw err
        }
         res.send(new SuccessModel())
        })
    ) 
    
})
//取消收藏
router.post('/delReply', loginCheck, (req, res, next) => {
    console.log(req.body)
    const sql = `DELETE FROM collect WHERE  user_id='${req.body.user_id}' and topic_id='${req.body.id}'`
    con.query(sql,  ((err,data) => {
        if(err){
            throw err
        }
         res.send(new SuccessModel())
        })
    ) 
})
//修改点赞数
router.post('/com',(req, res, next) => {
    const result = updatecomment(req.body.topic_id, req.body.num)
    return result.then(data =>{
        res.json(new SuccessModel())
    })
})
//查看全部用户
router.post('/admin', loginCheck, (req, res, next) =>{
    const result = getUsers()
    return result.then(data =>{
        res.json(new SuccessModel(data))
    })
})
//查看全部版块
router.post('/adminTSID', loginCheck, (req, res, next) =>{
    const result = getTSID()
    return result.then(data =>{
        res.json(new SuccessModel(data))
    })
})
//查看全部文章
router.post('/admintext', loginCheck, (req, res, next) =>{
    const result = getText()
    return result.then(data =>{
        res.json(new SuccessModel(data))
    })
})
//查看版块文章
router.post('/admintitle', loginCheck, (req, res, next) =>{
    const result = getTSIDS(req.body.name)
    return result.then(data =>{
        res.json(new SuccessModel(data))
    })
})
//删除版块
router.post('/delTSID',loginCheck,(req, res, next) =>{
    const result = deleleTSID(req.body.id)
    return result.then(data =>{
        res.json(new SuccessModel())
    })
})
//点赞
router.post('/updateLike',loginCheck,(req, res, next) =>{
    const result = getLike(req.body.id, req.body.topic_id)
    return result.then(data =>{
        res.json(new SuccessModel())
    })
})
//取消点赞
router.post('/delLikes',(req, res, next) =>{
    const result = getLikes(req.body.id,req.body.topic_id)
    return result.then(data =>{
        res.json(new SuccessModel(data))
    })
})
//查询是否点赞
router.get('/selectlikes', (req, res, next) => {
    console.log(1)
    const result = selectlikes(req.query.id, req.query.topic_id)
    
    return result.then(data => {
        if(data.length > 0){
            res.json(new SuccessModel(data))
        }else{
            res.json(new ErrorModel(data))
        }
        
    })
})
//修改积分
router.post('/point',(req,res, next)=>{
    const result = updatePoint(req.body.id,req.body.num)
    return result.then(data =>{
        res.json(new SuccessModel())
    })
})
//道具
router.get('/shop',(req,res, next)=>{
    const result = getShop()
    return result.then(data =>{
        res.json(new SuccessModel(data))
    })
})
//修改道具
router.post('/updategood',(req,res, next)=>{
    var form = new formidable.IncomingForm(); 
    form.uploadDir = "./public/goods";
    form.keepExtensions = true;
    // 解析表单， fields表示文本域，files表示文件域
    form.parse(req, function(err, fields, files) {
        console.log(fields)
        files.file.path = files.file.path.replace(/\\/g,'\\\\')
        var path = 'http://localhost:8000/' + files.file.path
        const result = getGoods(fields.id,fields.name,fields.point,fields.number,fields.cdk,path)
        return result.then(data =>{
            res.json(new SuccessModel(data))
        })
    })
})
//新增道具
router.post('/insertgoods',(req, res, next) =>{
    var form = new formidable.IncomingForm(); 
    form.uploadDir = "./public/goods";
    form.keepExtensions = true;
    // 解析表单， fields表示文本域，files表示文件域
    form.parse(req, function(err, fields, files) {
        files.file.path = files.file.path.replace(/\\/g,'\\\\')
        var path = 'http://localhost:8000/' + files.file.path
        console.log(files.file.path)
        const result = getInsetgoods(fields.name,fields.point,fields.number,fields.cdk,path)
        return result.then(data =>{
            res.json(new SuccessModel())
        }) 
    })
})
//编辑板块
router.post('/updateTSID',(req,res, next)=>{
    
    const result = getupdateTSID(req.body.id,req.body.name,req.body.content)
    return result.then(data =>{
        res.json(new SuccessModel())
    })
})
//新增版块
router.post('/insetTSID',(req,res, next)=>{
    const result = getInsetTs(req.body.name,req.body.content)
    return result.then(data =>{
        res.json(new SuccessModel())
    })
})
//兑换道具
router.post('/goods',(req,res, next)=>{
    const result = getGoodes(req.body.id,req.body.num)
    return result.then(data =>{
        res.json(new SuccessModel())
    })
})
//更新积分
router.post('/insertpoint',(req,res, next)=>{
    const result = getUpoint(req.body.id,req.body.point)
    return result.then(data =>{
        res.json(new SuccessModel())
    })
})
//把道具CDK发送给用户
router.post('/insertuserInfo',(req,res, next)=>{
    const result = setUserInfo(req.body.id,req.body.goods_id,req.body.goods_cdk,req.body.goodsname)
    return result.then(data =>{
        res.json(new SuccessModel())
    })
})
//用户接收道具CDK
router.post('/getuserInfo',(req,res, next)=>{
    console.log(req.body.id)
    const result = getUserInfo(req.body.id)
    return result.then(data =>{
        res.json(new SuccessModel(data))
    })
})
//删除道具
router.post('/delgoods',(req,res,next)=>{
    const result = delgoods(req.body.id)
    return result.then(data=>{
        res.json(new SuccessModel())
    })
})
module.exports = router;