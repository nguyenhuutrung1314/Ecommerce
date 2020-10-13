var url = require('url');
var express = require("express");
var router = express.Router();
var formidable = require('formidable');
var fs = require('fs');
var xldl = require('../xulydulieu/xldl_admin');

function isAdminLoggedin(req, res, next) {
	if (req.isAuthenticated() && req.user.phanquyen == 1) {
	  return next();
	}
	res.redirect('/');
}

router.get('/admin', isAdminLoggedin, async function(req, res){
	res.render('admin', {body: 'admin/bangdieukhien.ejs'});
});

router.get('/admin/quanlygianhang', isAdminLoggedin, async function(req, res){
	var dssp = await xldl.danhsachsanpham();
	res.render('admin', {
		body: 'admin/quanlygianhang.ejs',
		dssp:dssp
	})
});

router.get('/admin/thongkekhachhang', isAdminLoggedin, async function(req, res){
	var dskh = await xldl.danhsachkhachhang();
	res.render('admin', {
		body: 'admin/thongkekhachhang.ejs',
		danhsachkhachhang:dskh
	})
});

router.get("/admin/chitiethoadonkh?:tenkh", isAdminLoggedin, async function(req,res){
	var tenkh=req.query.tenkh;
	var danhsachhoadon= await xldl.danhsachhoadonkhachhang(tenkh);
	res.render('admin', {
		body: 'admin/thongkechitietkhachhang.ejs',
		tenkh:tenkh,
		danhsachhoahonKH:danhsachhoadon
		})
})

router.get('/admin/quanlydonhang', isAdminLoggedin, async function(req, res){
	var dsdh = await xldl.danhsachdonhang();
	res.render('admin', {
		body: 'admin/thongkedonhang.ejs',
		danhsachdonhang:dsdh
	})
});

router.get("/admin/chitietdonhang?:madonhang", isAdminLoggedin, async function(req,res){
	var rs = await xldl.findbill(req.query.madonhang);
	var chitietdonhang = await xldl.chitietdonhang(req.query.madonhang);
	var trangthai = await xldl.arraytrangthai();
    res.render('admin', {body: 'admin/capnhatdonhang.ejs', updatebill: rs, dssp: chitietdonhang[0], tongtien: chitietdonhang[1], trangthai: trangthai});
})

function thetimenow(){
	var date = new Date();
    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;
    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;
    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;
    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;
	now = year + "-" + month + "-" + day + " " + hour + ":" + min + ":" + sec;
	
	return now;
}
router.get('/admin/updateProduct?:masanpham', isAdminLoggedin, async function(req, res) {
	var rs = await xldl.findproduct(req.query.masanpham);
	var dsloaisp = await xldl.arrayloaisp();
	var dsthuonghieu = await xldl.arraythuonghieu();
	var now = thetimenow();
    res.render('admin', {body: 'admin/capnhatsanpham.ejs', updateproduct: rs, dsloaisp: dsloaisp, dsthuonghieu: dsthuonghieu, ngaycapnhat: now});
});

var img="";
router.post('/admin/fileupload', isAdminLoggedin, async function(req, res) {
	console.log("chạy file");
	var form = new formidable.IncomingForm();
    await form.parse(req, await function (err, fields, files) {
		img = files.filetoupload.name;
		var oldpath = files.filetoupload.path;
		var newpath = 'C:/Users/PC/Desktop/websiteappp/public/images/products/' + files.filetoupload.name;
		fs.rename(oldpath, newpath, function (err) {
			if (err) throw err;
		});
	});
});

router.post('/admin/adminUpdateProduct', isAdminLoggedin, async function(req, res) {
	console.log("chạy update");
	var id = req.body.idsp;
	var name = req.body.name;
	var thuonghieu = req.body.thuonghieu;
	var loai = req.body.loai;
	var gioitinh = req.body.gioitinh;
	var u_price = req.body.unit_price;
	var p_price = req.body.promotion_price;
	var des = req.body.description;
	var update_at = req.body.ngaycapnhat;
	await xldl.updateProduct([ name, thuonghieu, loai, gioitinh, u_price, p_price, des, update_at, img, id]);
	res.redirect('/admin/quanlygianhang');
});

router.get('/admin/addproduct', isAdminLoggedin, async function(req, res) {
	var dsloaisp = await xldl.arrayloaisp();
	var dsthuonghieu = await xldl.arraythuonghieu();
	
	var now = thetimenow();
	res.render('admin', {
		body: "admin/themsanpham.ejs", 
		dsthuonghieu: dsthuonghieu, 
		dsloaisp: dsloaisp,
		ngaytao: now,
		ngaycapnhat: now
	});
});

router.post('/admin/adminAddProduct', isAdminLoggedin, async function(req, res) {
	console.log("chạy hàm text");
	var name = req.body.name;
	var thuonghieu = req.body.thuonghieu;
	var loai = req.body.loai;
	var gioitinh = req.body.gioitinh;
	var des = req.body.description;
	var u_price = req.body.unit_price;
	var p_price = req.body.promotion_price;
	var create_at = req.body.ngaytao;
	var update_at = req.body.ngaycapnhat;
	await xldl.addProduct ([ name, thuonghieu, loai, gioitinh, des, u_price, p_price, img, create_at, update_at]);
	res.redirect('/admin/addproduct'); 
});

router.post('/admin/chitietdonhang/adminUpdateBill', isAdminLoggedin, async function(req, res) {
	var idbill = req.body.idbill;
	var trangthai = req.body.trangthai;
	await xldl.updateBill([ trangthai, idbill]);
	res.redirect('/admin/quanlydonhang');
});



module.exports = router;