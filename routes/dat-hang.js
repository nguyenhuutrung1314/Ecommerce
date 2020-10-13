var express = require('express');
var csdl = require('../xulydulieu/xulysanpham.js')
var router = express.Router();
 
/* GET home page. */
function isLoggedin(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
    res.write(`<script>
    alert(\`bạn cần phải đăng nhập để vào trang này!\`);
  window.open("/","_self");
  </script>`);  
    res.end();
    res.redirect('/');
  }
}
router.get('/dat-hang',isLoggedin, async function(req, res, next) {
  //var spmoi = await csdl.soluongsp("select count(id) as num from products where");

  await csdl.XuLyMuaHang(req);
  var giohang= await csdl.HienThiGioHang(req.session.giohang);
 
  var hienthi= await csdl.Loainuochoa();
  var donhang= await csdl.HienThiDonHang(req.session.giohang);
  var user=req.user;
  res.render('dathang', {hienthigiohang:giohang,donhang:donhang,hienthi:hienthi,user:user});
});

module.exports = router;