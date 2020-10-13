var express = require('express');
var csdl = require('../xulydulieu/xulysanpham.js')
var router = express.Router();
var url = require('url');

router.get('/s', async function(req, res, next) {
  //var spmoi = await csdl.soluongsp("select count(id) as num from products where");

  await csdl.XuLyMuaHang(req);
  var giohang= await csdl.HienThiGioHang(req.session.giohang);
  var hienthi= await csdl.Loainuochoa();
  var requrl;
  var tensp;
  if(req.url != '/favicon.ico'){
    requrl = url.parse(req.url, true);
     tensp = requrl.query.search;
        console.log('tensp:'+tensp);
        // if(requrl.search!=undefined)
        //     tensp=requrl.search;
        console.log(tensp);
        kqtk=await csdl.find(100,tensp);
  }
 
  var soluong = await csdl.soluongsp("select count(id) as num from products where name like'%"+tensp+"%' or description like '%" + tensp +"'");
  console.log(soluong);
  res.render('search', {count1: 10, count: soluong,hienthigiohang:giohang,hienthi:hienthi,kqtk:kqtk,tensp:tensp});
});

module.exports = router;
