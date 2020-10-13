var url = require('url');
var express = require("express");
var router = express.Router();
var xldl = require('../../xulydulieu/xldl_admin')
router.get('/thongkebanhang', async function(req, res){
	res.render('admin');
});
function isAdminLoggedin(req, res, next) {
	if (req.isAuthenticated() && req.user.phanquyen == 1) {
	  return next();
	}
	res.redirect('/');
}

router.get('/admin/thongkebanhang', isAdminLoggedin, async function(req, res){//chưa có file thongke
	var tongdoanhthu=await xldl.tongdoanhso();
	// console.log(tongdoanhthu.tongket["nuochoanhapkhau"]+"tong doanh thu");
	res.render('admin', {body: 'admin/thongke.ejs',tongdoanhthu:tongdoanhthu});
});

router.post("/admin/thongkebanhang", isAdminLoggedin, async function(req,res){
		var type=req.body.loai;
		var ngay =req.body.bday;
		var thang= req.body.bmonth;
		var nam=req.body.byear;
		console.log(type+" "+ngay+" "+thang+" "+nam);
		if(type == "none")
			{
				await xldl.tongdoanhso(function(result){
					console.log(result+""+ấd);
					var user=req.user;
					res.render("admin",{user:user,tongdoanhthu:result,body:"admin/thongke.ejs" });
				})
			}// đúng rồi
		else if (type=="ngay"){
			var doanhthungay=await xldl.doanhthungay(ngay);
			console.log(doanhthungay);
			var user=req.user;
			res.render("admin",{user:user,tongdoanhthu:doanhthungay,body:"admin/thongkedoanhso.ejs"});
		}
		else if(type== "thang"){
			var doanhthuthang=await xldl.doanhthuthang(thang);
			console.log(doanhthuthang);
			var user=req.user;
			res.render("admin",{user:user,tongdoanhthu:doanhthuthang,body:"admin/thongkedoanhso.ejs"});
		}
		else {
			var doanhthunam=await xldl.doanhthunam(nam);
			console.log(doanhthunam);
			var user=req.user;
			res.render("admin",{user:user,tongdoanhthu:doanhthunam,body:"admin/thongkedoanhso.ejs"});
		}	
})

module.exports = router;