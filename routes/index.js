var express = require('express');
var csdl = require('../xulydulieu/xulysanpham.js')
var xldl= require('../xulydulieu/xldl_admin.js')
var router = express.Router();
 
/* GET home page. */
router.get('/', async function(req, res, next) {
  //var spmoi = await csdl.soluongsp("select count(id) as num from products where");

  await csdl.XuLyMuaHang(req);
 // var giohang= await csdl.HienThiGioHang(req.session.giohang);
  var hienthi= await csdl.Loainuochoa();
  var numsphot = await csdl.soluongsp("select count(id) as num from products");
  var spmoi = await csdl.dssp(4, 1);
  var sphot = await csdl.dssp(8, 2);
  var user =req.user;
  // var kq1=await xldl.loaisp();
  // console.log(kq1)
  res.render('index', {count1: 10, count2: numsphot, spmoi: spmoi, sphot: sphot,/*hienthigiohang:giohang,*/hienthi:hienthi,user:user});
});

router.post('/hienthigiohang', async function(req, res, next) {
  var giohang= await csdl.HienThiGioHang(req.session.giohang);
  res.send(giohang);
});




module.exports = router;
