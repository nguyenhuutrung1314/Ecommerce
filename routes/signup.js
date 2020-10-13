
var url = require('url');
var csdl = require('../xulydulieu/xulysanpham.js');
flash = require("connect-flash")
function ketnoi(){
    var mysql = require('mysql2/promise');
    var pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password:'123',
    database: 'quanlybanhang',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
    });
    return pool;
    }
exports.signup= async function(req,res){
    var pool=ketnoi();
    message='';
    var hienthi= await csdl.Loainuochoa();
    await csdl.XuLyMuaHang(req);
    var giohang= await csdl.HienThiGioHang(req.session.giohang);
    if(req.method == "POST"){
        var post= req.body;
        var email= post.email;
		var pass= post.password;
       var fname= post.full_name;
       var adr= post.address;
       var phone=post.phone;
       var re_pass=post.re_password;
 
        pool.query("select * from users where email = '"+email+"'",function(err,results){
            console.log(results);

            if(results.length){
                
                message= "<div class = \"alert alert-danger\">"+"email đã có người sử dụng!"+"</div>";
                
                res.render('signup',{message: message,hienthi:hienthi,hienthigiohang:giohang});
            }
            else{
                if(pass!= re_pass){
                   
                    message = "<div class=\"alert alert-danger\" role=\"alert\">"+'hãy nhập lại mật khẩu của bạn cho trùng với mật khẩu' +"</div>";
                    res.render('signup',{message: message,hienthi:hienthi,hienthigiohang:giohang});
                    
                }
                else{
            var sql = "INSERT INTO `users`(`full_name`,`email`,`password`,`phone`,`address` ) VALUES ('" + fname + "','" + email + "','" + pass + "','" + phone + "','" + adr + "')";
            pool.query(sql,function(err,result){
           
            // message = "<div class=\"alert alert-success\" role=\"alert\">"+ "Đăng ký thành công!" +"</div>";
            res.render('login',{hienthi:hienthi});
            });
            }
        }
        })
    } 
    else{
        res.render('signup',{hienthi:hienthi,hienthigiohang:giohang});
    }
    
};
