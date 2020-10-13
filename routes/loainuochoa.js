var url = require('url');
var express = require("express");
var router = express.Router();
var csdl = require('../xulydulieu/xulysanpham.js');

router.get('/loaisanpham/',async function(req, res, next) {
    var requrl;
	if(req.url != '/favicon.ico'){
		requrl = url.parse(req.url, true);
        var maloai = requrl.query.maloai;
        console.log(maloai);
        if(requrl.maloai!=undefined)
            maloai=requrl.maloai;
        dssp=await csdl.dssp1(8,maloai);
        
  await csdl.XuLyMuaHang(req);
  var giohang= await csdl.HienThiGioHang(req.session.giohang);
  var soluong = await csdl.soluongsp("select count(p.id) as num from products p, loainuochoa loai where p.id_loai = loai.id and loai.id=" + maloai);
  console.log(soluong);
  var hienthi= await csdl.Loainuochoa();
    res.render("product_type",{dssp:dssp,hienthigiohang:giohang,hienthi:hienthi,count1:soluong});
}
});

module.exports = router;