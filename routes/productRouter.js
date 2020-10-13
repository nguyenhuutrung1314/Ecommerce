var url = require('url');
var express = require("express");
var router = express.Router();
var xulysanpham = require('../xulydulieu/xulysanpham.js');

router.get('/sanpham', async function(req, res) {
	var requrl;
	if(req.url != '/favicon.ico'){
		requrl = url.parse(req.url, true);
		var hienthi= await xulysanpham.Loainuochoa();
		var masanpham = requrl.query.masanpham;
		var ctsp = await xulysanpham.chitietsanpham(masanpham);
		var property = ctsp[0];
		var giasp = ctsp[1];
		var sanphamlienquan = await xulysanpham.dssplienquan(6, masanpham);
		var name="Nước hoa mới";
		var link = "/";
		var img = "";
		var codegiasp = "";
		var mota = "";
		var splq = "";
		var spbanchay = "";
		var spmoi = "";
		var betasp = await xulysanpham.dssp_banchay_spmoi();
		var rsspbanchay = betasp[0];
		var rsspmoi = betasp[1];
		if(masanpham != undefined){
			name = property.tensp;
			link = property.tenloai;
			img = property.image;
			codegiasp = giasp;
			mota = property.description;
			splq = sanphamlienquan;
			spbanchay = rsspbanchay;
			spmoi = rsspmoi;
		}

		await xulysanpham.XuLyMuaHang(req);
		var muasanpham= await xulysanpham.muachitietsanpham(masanpham);

  var giohang= await xulysanpham.HienThiGioHang(req.session.giohang);

		res.render('product', {
			title: name,
			name: name,
			link: link,
			images: img,
			codegiasp: codegiasp,
			mota: mota,
			splq: splq,
			spbanchay: spbanchay,
			spmoi: spmoi,
			hienthigiohang:giohang,
			muasanphamchitiet:muasanpham,
			hienthi:hienthi
		});
	}
});


module.exports = router;