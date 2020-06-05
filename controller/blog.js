const xss = require('xss')
const { exec } = require('../db/mysql')
const {getRandom} = require('../controller/user')

const getUser = (keyword) => {
    let sql = `select * from user where user_id='${keyword}'`
    return exec(sql)
}
//修改信息
const getUpdatauser = (id,name,signature,sex,age,address,vocation) =>{
    const sql = `
        update user set realname='${name}', signature='${signature}',signature='${signature}',
        sex='${sex}',age='${age}',address='${address}',vocation='${vocation}' where user_id='${id}'
    `
    return exec(sql)
}
//获取帖子列表
const getList = (keyword) => {
    let key = keyword
    console.log(key)
    let sql = `select * from blogs where concat(title,author,Sname,content,user_id) like '%${key}%' order by createtime desc`

    // 返回 promise
    return exec(sql)
}
//获取收藏帖子列表
const getCollect = (id) =>{
    let sql = `select * from collect where user_id='${id}'`
    return exec(sql)
}
//首页推荐
const getHot = (index) => {
    let sql = ''
    if(index == 0){
        sql = `select * from blogs order by TClickCount desc `
    }else if(index == 1){
        sql = ` select * from blogs order by likes desc`
    }else{
         sql = ` select * from blogs order by TReplyCount desc`
    }
    // 返回 promise
    return exec(sql)
}
//版块信息
const getComposite = (id) => {
    let sql = `select * from blogs where TSID='${id}' order by createtime desc`
    // 返回 promise
    return exec(sql)
}
//查看帖子
const getDetail = (id) => {
    const sql = `select title,author,createtime,content,TReplyCount,TClickCount,likes,user_id from blogs where id='${id}'
    `
    return exec(sql).then(rows => {
        return rows[0]
    })
}
//查看评论
const getComment = (id) =>{
    const sql = `select content,createtime,uname from comment where topic_id='${id}'`
    return exec(sql)
}
//发布评论
const newComment =(userId, value, uname, id) => {
    const data = new Date()
    const createTime = dateFormat("YYYY-mm-dd HH:MM",data)
    const sql = `
        insert into comment ( from_uid, content, createtime, uname, topic_id)
        values ('${userId}', '${value}', '${createTime}', '${uname}', '${id}');
    `

    return exec(sql).then(insertData => {
        return {
            id: insertData.insertId
        }
    })
}
//查看用户
const getUsers = () =>{
    const sql = `select * from user where 1`
    return exec(sql)
}
//获取时间
function dateFormat(fmt, date) {
    let ret;
    const opt = {
        "Y+": date.getFullYear().toString(),        // 年
        "m+": (date.getMonth() + 1).toString(),     // 月
        "d+": date.getDate().toString(),            // 日
        "H+": date.getHours().toString(),           // 时
        "M+": date.getMinutes().toString(),         // 分
        "S+": date.getSeconds().toString()          // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        };
    };
    return fmt;
}
//发布新帖
const newBlog = (Sanme,title,content,author,TSID,userId ) => {
    // blogData 是一个博客对象，包含 title content author 属性
   
    // console.log('title is', title)
    const id = getRandom()
    const data = new Date()
    const createTime = dateFormat("YYYY-mm-dd HH:MM",data)

    const sql = `
        insert into blogs (id, Sname, title, content, author,createtime, TSID, user_id)
        values ('${id}','${Sanme}','${title}', '${content}', '${author}','${createTime}','${TSID}','${userId}' );
    `

    return exec(sql)
   
}
//修改贴子
const updateBlog = (topic_id,Sname,title,content,TSID) => {
    // id 就是要更新博客的 id
    // blogData 是一个博客对象，包含 title content 属性
    const data = new Date()
    const createTime = dateFormat("YYYY-mm-dd HH:MM",data)
    const sql = `
    UPDATE blogs SET title='${title}',content='${content}',
    createtime='${createTime}',Sname='${Sname}',TSID='${TSID}' WHERE id='${topic_id}'
    `
    return exec(sql)
}
//删除收藏博客
const delBlog = (id,userId) => {
    // id 就是要删除博客的 id
    const sql = `delete from collect where topic_id='${id}' and user_id='${userId}'`
    return exec(sql).then(delData => {
        // console.log('delData is ', delData)
        if (delData.affectedRows > 0) {
            return true
        }
        return false
    })
}
//删除博客
const deleleBlog = (id) => {
    // id 就是要删除博客的 id
    const sql = `delete from blogs where id='${id}'`
    return exec(sql).then(delData => {
        // console.log('delData is ', delData)
        if (delData.affectedRows > 0) {
            return true
        }
        return false
    })
}
//删除版块
const deleleTSID = (id) => {
    // id 就是要删除博客的 id
    const sql = `delete from reply where TSID='${id}'`
    return exec(sql).then(delData => {
        // console.log('delData is ', delData)
        if (delData.affectedRows > 0) {
            return true
        }
        return false
    })
}
//更新文章点击量
const updateClick = (id,num) =>{
    const sql = `
    UPDATE blogs SET TClickCount='${num}' WHERE id='${id}'
    `
    return exec(sql)
}
//查询板块分类
const getReply = () => {
    let sql = `select Sname,TSID,content from reply order by TSID `
    // 返回 promise
    return exec(sql)
}
//修改点赞数
const updatecomment = (id,num) => {
    const sql = `
    UPDATE blogs SET likes='${num}' WHERE id='${id}'
    `
    return exec(sql)
}
//查看全部版块
const getTSID = () =>{
    const sql = `select TSID,Sname,content from reply order by TSID`
    return exec(sql)
}
//查看全部文章
const getText = () =>{
    const sql = `select * from blogs order by createtime desc`
    return exec(sql)
}
//查看板块文章
const getTSIDS = (name) =>{
    const sql = `select * from blogs where Sname='${name}' order by createtime desc`
    return exec(sql)
}
//点赞
const getLike =(id, topic_id) => {
    const sql = `
    INSERT INTO likes(user_id, topic_id) VALUES ('${id}','${topic_id}')
    `
    return exec(sql)
}
//取消点赞
const getLikes =(id,topic_id) =>{
    const sql = `DELETE  FROM likes WHERE topic_id='${topic_id}' and user_id='${id}'`
    return exec(sql)
}
//查询是否点赞
const selectlikes = (id,topic_id) => {
    const sql = `SELECT * FROM likes WHERE topic_id='${topic_id}' and user_id='${id}'`
    return exec(sql)
}
//查询是否收藏
const getcollect = (id,topic_id) => {
    const sql = `SELECT * FROM collect WHERE topic_id='${topic_id}' and user_id='${id}'`
    return exec(sql)
}
//积分
const updatePoint =(id,num) =>{
    const sql = `
    UPDATE user SET UPoint='${num}' WHERE user_id='${id}'
    `
    return exec(sql)
}
//道具
const getShop =() =>{
    const sql = `
    SELECT * FROM shop WHERE 1
    `
    return exec(sql)
}
//修改某一道具
const getGoods =(id,name,point,num,cdk,img) =>{
    console.log(img)
    const sql = `
    UPDATE shop SET number='${num}',Point='${point}',goods='${name}',CDK='${cdk}',img='${img}' WHERE id='${id}'
    `
    return exec(sql)
}
//新增道具
const getInsetgoods =(name,point,num,cdk,img) =>{
    //img = escape(img)
    console.log(img)
    const sql = `
    INSERT INTO shop(goods, Point, number, CDK, img) VALUES ('${name}','${point}','${num}','${cdk}','${img}')
    `
    return exec(sql)
}
//编辑板块
const getupdateTSID =(id,name,content) =>{
    const sql = `
    UPDATE reply SET Sname='${name}',content='${content}' WHERE TSID='${id}'
    `
    return exec(sql)
}
//新增版块
const getInsetTs =(name, content) =>{
    const sql = `
    INSERT INTO reply(Sname, content) VALUES ('${name}','${content})
    `
    return exec(sql)
}
//兑换道具
const getGoodes =(id,num) =>{
    const sql = `
    UPDATE shop SET number='${num}' WHERE id='${id}'
    `
    return exec(sql)
}
//兑换道具后积分变化
const getUpoint =(id,num) =>{
    const sql = `
    UPDATE user SET UPoint='${num}' WHERE user_id='${id}'
    `
    return exec(sql)
}
//把道具CDK发送给用户
const setUserInfo = (id, goods_id, goods_cdk, goodsname) =>{
    const sql = `INSERT INTO userinfo(user_id, goods_id, goods_cdk,goodsname) VALUES ('${id}','${goods_id}','${goods_cdk}','${goodsname}')`
    return exec(sql)
}
//用户接收道具CDK
const getUserInfo = (id) =>{
    const sql = `SELECT * FROM userinfo WHERE user_id='${id}'`
    return exec(sql)
}
//删除道具
const delgoods = (id) => {
    const sql = `DELETE FROM shop WHERE id='${id}'`
    return exec(sql)
}
module.exports = {
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
    deleleBlog,
    updateClick,
    updatecomment,
    deleleTSID,
    getLike,
    getLikes,
    updatePoint,
    getShop,
    getGoods,
    getInsetgoods,
    getupdateTSID,
    getInsetTs,
    getGoodes,
    getUpoint,
    getUserInfo,
    setUserInfo,
    delgoods,
    selectlikes,
    getcollect
}