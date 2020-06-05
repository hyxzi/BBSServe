const { exec, escape } = require('../db/mysql')
const { genPassword } = require('../utils/cryp')

const login = (username, password) => {
    username = escape(username)
    console.log(username)
    // 生成加密密码
    //password = genPassword(password)
    password = escape(password)
    //console.log(password)
    const sql = `
        select username, realname, user_id, UPoint,password from user 
        where username=${username} and password=${password}
    `
    return exec(sql).then(rows=> {
        return rows[0] || {}
    })
}
//管理员登录
const adminlogin = (username, password) => {
    username = escape(username)
    password = escape(password)
    const sql = `
        select username, realname, id from admin where username=${username} and password=${password}
    `
    return exec(sql).then(rows =>{
        return rows[0] ||{}
    })
}
//注销用户
const getdel = (id) =>{
    
    const sql = `DELETE FROM user WHERE user_id='${id}'`
    return exec(sql)
}
//修改用户
const updateuser = (id,username,password) => {
    const sql = `UPDATE user SET username='${username}',password='${password}' WHERE user_id='${id}'`
    return exec(sql)
}
//生成用户id
function getRandom() { 
        var code = "";  
        var codeLength = 5; 
        var random = new Array(0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f','g','h','i','j','k','l','m','n','o','p','q','r',  
                               's','t','u','v','w','x','y','z');
        for(var i = 0; i < codeLength; i++) { 
          var index = Math.floor(Math.random()*35);
          code += random[index];
        }  
        return code;
}
//修改用户图像
const updateimg = (id, imgurl) =>{
    
    imgurl = escape(imgurl)
    const sql = `UPDATE user SET imgurl=${imgurl} WHERE username='${id}'`
    return exec(sql)
}
//忘记密码
const forget = (username) =>{
    const sql = `select email,password from user  where username='${username}'`
    return exec(sql)
}
module.exports = {
    login,
    getRandom,
    adminlogin,
    getdel,
    updateuser,
    updateimg,
    forget
}