function ketnoi(){
    var mysql = require('mysql2/promise');
    var pool = mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'quanlybanhang'
    });
    return pool;
}
//lấy tổng số sản phẩm
module.exports.soluongsp = async function (que){
    var pool = ketnoi();
    var rs = await pool.query(que);
    c = rs[0][0].num;
    return c;
}
//liệt kê ds sản phẩm 
module.exports.dssp = async function(n, loaisp){
    var pool = ketnoi();
	var classgrid="col-sm-6 col-md-4 col-lg-3";
	var sosp1hang=4;
	var rs_spmoi = await pool.query("select p.id, p.name, p.image, p.unit_price, p.promotion_price, loai.name as loai from products p, loainuochoa loai where p.id_loai = loai.id order by p.updated_at DESC");
	var rs_sphot = await pool.query("select bd.id_product as id, p.name, p.image, p.unit_price, p.promotion_price, loai.name as loai, sum(quantity) as sum from products p, bill_detail bd, loainuochoa loai where p.id = bd.id_product and p.id_loai = loai.id group by bd.id_product order by sum(quantity) desc");
	var dssp;
	if(loaisp==1)
		dssp = rs_spmoi[0];
	if(loaisp==2)
		dssp = rs_sphot[0];
    var code = "";
    for(i = 0; i < n; i++){
		if(i==0)
			code += "<div class=\"row\">";
		if(i%sosp1hang==0 && i>0)
			code += "<div class=\"space40\">&nbsp;</div><div class=\"row\">";
        code += "<div class=\""+classgrid+"\"><div class=\"single-item\"><a href=\"http://localhost:8000/sanpham/?loaisp="+dssp[i].loai+"&&masanpham="+dssp[i].id+"\"><div class=\"single-item-header\"><img src=\"/images/products/";
        code += dssp[i].image +"\" alt=\"\"></div><div class=\"single-item-body\"><p class=\"single-item-title\">";
		code += dssp[i].name +"</p><p class=\"single-item-price\">";
		if(dssp[i].unit_price == dssp[i].promotion_price)
			code += "<span>"+dssp[i].unit_price+"</span>";
		else 
			code += "<span class=\"flash-del\">"+dssp[i].unit_price+"</span><span class=\"flash-sale\">"+dssp[i].promotion_price+"</span>";
		//code += "</p></div></a><div class=\"single-item-caption\"><a class=\"add-to-cart pull-left\" href=\"/?muanuochoa="+dssp[i].id+"&tennuochoa="+dssp[i].name+"&soluongmua=1"+"&gianuochoa="+dssp[i].promotion_price+"&hinhanhnuochoa="+dssp[i].image+"\"><i class=\"fa fa-shopping-cart\"></i></a><a class=\"beta-btn primary\" href=\"http://localhost:8000/sanpham/?loaisp="+dssp[i].loai+"&&masanpham="+dssp[i].id+"\">Chi tiết <i class=\"fa fa-chevron-right\"></i></a><div class=\"clearfix\"></div></div></div></div>";
		code += "</p></div></a><div class=\"single-item-caption\"><a  class=\"add-to-cart pull-left\" onclick=\"themvaogiohang('"+dssp[i].id+"','"+dssp[i].name+"','"+dssp[i].promotion_price+"','"+dssp[i].image+"')\"><i class=\"fa fa-shopping-cart\"></i></a><a class=\"beta-btn primary\" href=\"http://localhost:8000/sanpham/?loaisp="+dssp[i].loai+"&&masanpham="+dssp[i].id+"\">Chi tiết <i class=\"fa fa-chevron-right\"></i></a><div class=\"clearfix\"></div></div></div></div>";
		if((i + 1) % sosp1hang == 0)
            code += "</div>";
	}
    return code;
}

//liệt kê ds sản phẩm liên quan
module.exports.dssplienquan = async function(n, masanpham){
    var pool = ketnoi();
	var classgrid="col-sm-4";
	var sosp1hang=3;
	//console.log(masanpham);
	//console.log("select id_thuonghieu, id_loai, gioitinh from products where id = \""+masanpham+"\"");
	var spgoc = await pool.query("select id_thuonghieu, id_loai, gioitinh from products where id = \""+masanpham+"\"");
	var gt=spgoc[0][0].gioitinh, th=spgoc[0][0].id_thuonghieu, loai=spgoc[0][0].id_loai;
	var splienquan = await pool.query("select p.id as id, p.name as tensp, p.image as img, p.unit_price, p.promotion_price, l.name as loai from products p, loainuochoa l where p.id != "+masanpham+" and p.id_loai=l.id and gioitinh=\""+gt+"\" AND id_thuonghieu = "+th+" and id_loai = "+loai+" UNION select p.id as id, p.name as tensp, p.image as img, p.unit_price, p.promotion_price, l.name as loai from products p, loainuochoa l where p.id != "+masanpham+" and p.id_loai=l.id and gioitinh=\""+gt+"\" AND id_thuonghieu = "+th+" UNION select p.id as id, p.name as tensp, p.image as img, p.unit_price, p.promotion_price, l.name as loai from products p, loainuochoa l where p.id != "+masanpham+" and p.id_loai=l.id and gioitinh=\""+gt+"\" AND id_loai = "+loai+" UNION select p.id as id, p.name as tensp, p.image as img, p.unit_price, p.promotion_price, l.name as loai from products p, loainuochoa l where p.id != "+masanpham+" and p.id_loai=l.id and id_loai = "+loai+" AND id_thuonghieu = "+th);
	var dssp = splienquan[0];
	var code = "";
	if(dssp.length<n)
		n=dssp.length;
    for(i = 0; i < n; i++){
		if(i==0)
			code += "<div class=\"row\">";
		if(i%sosp1hang==0 && i>0)
			code += "<div class=\"space40\">&nbsp;</div><div class=\"row\">";
		code += "<div class=\""+classgrid+"\"><div class=\"single-item\"><a href=\"http://localhost:8000/sanpham/?loaisp="+dssp[i].loai+"&&masanpham="+dssp[i].id+"\"><div class=\"single-item-header\"><img src=\"/images/products/";
		code += dssp[i].img +"\" alt=\"\"></div><div class=\"single-item-body\"><p class=\"single-item-title\">";
		code += dssp[i].tensp +"</p><p class=\"single-item-price\">";
		if(dssp[i].unit_price == dssp[i].promotion_price)
			code += "<span>"+dssp[i].unit_price+"</span>";
		else
			code += "<span class=\"flash-del\">"+dssp[i].unit_price+"</span><span class=\"flash-sale\">"+dssp[i].promotion_price+"</span>";
		//code += "</p></div></a><div class=\"single-item-caption\"><a class=\"add-to-cart pull-left\" href=\"http://localhost:8000/sanpham/?loaisp="+dssp[i].loai+"&&masanpham="+dssp[i].id+"&muanuochoa="+dssp[i].id+"&tennuochoa="+dssp[i].tensp+"&soluongmua=1"+"&gianuochoa="+dssp[i].promotion_price+"&hinhanhnuochoa="+dssp[i].img+"\"><i class=\"fa fa-shopping-cart\"></i></a><a class=\"beta-btn primary\" href=\"http://localhost:8000/sanpham/?loaisp="+dssp[i].loai+"&&masanpham="+dssp[i].id+"\">Chi tiết <i class=\"fa fa-chevron-right\"></i></a><div class=\"clearfix\"></div></div></div></div>";
		code += "</p></div></a><div class=\"single-item-caption\"><a  class=\"add-to-cart pull-left\" onclick=\"themvaogiohang('"+dssp[i].id+"','"+dssp[i].tensp+"','"+dssp[i].promotion_price+"','"+dssp[i].img+"')\"><i class=\"fa fa-shopping-cart\"></i></a><a class=\"beta-btn primary\" href=\"http://localhost:8000/sanpham/?loaisp="+dssp[i].loai+"&&masanpham="+dssp[i].id+"\">Chi tiết <i class=\"fa fa-chevron-right\"></i></a><div class=\"clearfix\"></div></div></div></div>";
		if((i + 1) % sosp1hang == 0)
			code += "</div>";
	}
    return code;
}

module.exports.chitietsanpham = async function(masanpham){
	var pool = ketnoi();
    var rs = await pool.query("select p.name as tensp, p.image, p.unit_price, p.promotion_price, loai.name as tenloai, description from products p, loainuochoa loai where p.id=\""+masanpham+"\" and p.id_loai = loai.id");
	var codegiasp = "";
	if(rs[0][0].unit_price == rs[0][0].promotion_price)
		codegiasp += "<span>"+rs[0][0].unit_price+"</span>";
	else
		codegiasp += "<span class=\"flash-del\">"+rs[0][0].unit_price+"</span><span class=\"flash-sale\">"+rs[0][0].promotion_price+"</span>";
	return [rs[0][0], codegiasp];
}

module.exports.muachitietsanpham = async function(masanpham){
	var pool = ketnoi();
    var rs = await pool.query("select p.name as tensp, p.image as image, p.unit_price, p.promotion_price as promotion_price, loai.name as tenloai, description from products p, loainuochoa loai where p.id=\""+masanpham+"\" and p.id_loai = loai.id");
	var kq="";
	
	kq+=`<div class="single-item"> <b>Thêm Vào Giỏ Hàng</b> <a class="add-to-cart pull-left" onClick="themvaogiohang('${masanpham}','${rs[0][0].tensp}','${rs[0][0].promotion_price}','${rs[0][0].image}')">  <i class="fa fa-shopping-cart"></i> </a> </div>`;
	return kq;
	/*<button onClick='xoanuochoa(" + giohang[i].manuochoa+")'>    <i class=\"fa fa-times\">\n" +
			"    </i>\n"+"</button>*/
}

module.exports.dssp_banchay_spmoi = async function(){
	var pool = ketnoi();
    var banchay = await pool.query("select p.id, p.name as tensp, bd.unit_price, p.image, loai.name as loai from products p, bill_detail bd, loainuochoa loai where p.id = bd.id_product and p.id_loai = loai.id group by bd.id_product order by sum(quantity) desc");
	var spmoi = await pool.query("select p.id, p.name as tensp, p.promotion_price, p.image, loai.name as loai from products p, loainuochoa loai where p.id_loai = loai.id order by p.updated_at DESC");
	var codespbanchay = "";
	var codespmoi = "";
	for(i=0; i<5; i++){
		codespbanchay += "<div class=\"media beta-sales-item\"><a class=\"pull-left\" href=\"http://localhost:8000/sanpham/?loaisp="+banchay[0][i].loai+"&&masanpham="+banchay[0][i].id+"\"><img src=\"/images/products/";
		codespbanchay += banchay[0][i].image +"\" alt=\"\"><div class=\"media-body\">";
		codespbanchay += banchay[0][i].tensp + "<br/><br/></a><span class=\"beta-sales-price\">";
		codespbanchay += banchay[0][i].unit_price + "</span></div></div>";
		
		codespmoi += "<div class=\"media beta-sales-item\"><a class=\"pull-left\" href=\"http://localhost:8000/sanpham/?loaisp"+spmoi[0][i].loai+"&&masanpham="+spmoi[0][i].id+"\"><img src=\"/images/products/";
		codespmoi += spmoi[0][i].image +"\" alt=\"\"><div class=\"media-body\">";
		codespmoi += spmoi[0][i].tensp + "<br/><br/></a><span class=\"beta-sales-price\">";
		codespmoi += spmoi[0][i].promotion_price + "</span></div></div>";
	}
	return [codespbanchay, codespmoi];
}

// var que = "select count(id) as num from products";
// soluongsp(que).then(function(ressult){
//     console.log(ressult);
// }); 


module.exports.Loainuochoa = async function () {
    var pool=ketnoi();
    var loainchoa = await pool.query('SELECT * from loainuochoa');// hien thi theo san pham
	Bangnuochoa = loainchoa[0];
    var kq = "";
    for (i = 0; i < Bangnuochoa.length; i++) {
        kq +="<li><a href=\"http://localhost:8000/loaisanpham/?loaisp="
        +Bangnuochoa[i].name + "&&maloai=" +Bangnuochoa[i].id  + "\">" + Bangnuochoa[i].name + "</a></li>";				
    }

    return kq;
}
//


module.exports.dathang= async function(tenkh,gioitinh,email,diachi,sdt,ghichu,hinhthucthanhtoan,giohang){
	var pool = ketnoi();
	var bills= await pool.query("SELECT MAX(id) as billsMax FROM bills");
	var customer = await pool.query("SELECT MAX(id) as customerMax FROM customer");
	var bill_detail = await pool.query("SELECT MAX(id) as bill_detailMax  FROM bill_detail");

	var billsSize=parseInt(bills[0][0].billsMax);
	var customerSize=parseInt(customer[0][0].customerMax);
	var bill_detailSize=parseInt(bill_detail[0][0].bill_detailMax);

	//console.log(`${billsSize} __${customerSize}__${bill_detailSize} `);

	var datetime = new Date();
	var tongtien=0;
	var  ThongtinEmail="";
	ThongtinEmail+=`<div class="your-order-head"><h5>Đơn hàng của bạn</h5></div>
	<div class="your-order-body" style="padding: 0px 10px">
		<div class="your-order-item">
			<div>`;

   //console.log(ngaymuahang);
	for (let index = 0; index < giohang.length; index++) {
		console.log(`${bill_detailSize},${billsSize+1},${giohang[index].manuochoa},${giohang[index].soluong},${giohang[index].dongia}`);
		await pool.query(`INSERT INTO bill_detail(id, id_bill, id_product, quantity, unit_price) VALUES (${bill_detailSize+=1},${billsSize+1},${giohang[index].manuochoa},${giohang[index].soluong},${giohang[index].dongia})`);
		console.log('insert thành công!')
		tongtien+=giohang[index].soluong*giohang[index].dongia;

		ThongtinEmail+=`<div class="media">
		<div class="media-body">
			<p class="font-large">${giohang[index].tennuochoa}</p>
			<span class="color-gray your-order-info">Đơn giá: ${giohang[index].dongia} đồng</span>
			<span class="color-gray your-order-info">Số lượng:${giohang[index].soluong}</span>
		</div>
	</div>`;
	}

	ThongtinEmail+=` </div>
	<div class="clearfix"></div>
</div>
<div class="your-order-item">
	<div class="pull-left"><p class="your-order-f18">Tổng tiền:</p></div>
	<div class="pull-right"><h5 class="color-black">${tongtien} đồng</h5></div>
	<div class="clearfix"></div>
</div>
</div>`;
ThongtinEmail += "<p>Cảm ơn Bạn đã đặt hàng ,Đơn hàng cuả bạn sẽ được giao sau khi bạn Xác nhận đơn hàng </p>"

        ThongtinEmail += "<p><a href='/?xacnhandh=" + billsSize+1 + "'>Xác nhận đơn hàng </a></p>"

	//console.log(`INSERT INTO bills(id, id_customer, date_order, total, payment, note) VALUES (${billsSize+1},${customerSize+1},NOW(),${tongtien},'${hinhthucthanhtoan}','${ghichu}')`);
	await pool.query(`INSERT INTO bills(id, id_customer, date_order, total, payment, note) VALUES (${billsSize+1},${customerSize+1},NOW(),${tongtien},'${hinhthucthanhtoan}','${ghichu}')`);

	await pool.query(`INSERT INTO customer(id, name, gender, email, address, phone_number, note) VALUES (${customerSize+1},'${tenkh}','${gioitinh}','${email}','${diachi}','${sdt}','${ghichu}')`);

	this.Goimail(email, "Don Hang", ThongtinEmail);

}

module.exports.Goimail =
    async function (email, tieude, noidung) {
        var nodemailer = require('nodemailer');

        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'nhom1hd1@gmail.com',
                pass: 'truongktr5'
            }
        });

        var mailOptions = {
            from: 'nhom1hd1@gmail.com',
            to: email,
            subject: tieude,
            html: noidung
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log(error);
            } else {
                console.log('Email sent: ' + info.response);
            }
        });
    }


module.exports.XuLyMuaHang = async function (req) {
	var url = require('url');
	//xu li mua hang
	var q = url.parse(req.url, true).query;

	if (q.typess=="xoa"){
		for (i=0;i<req.session.giohang.length;i++){
			if (req.session.giohang[i].manuochoa==q.manuochoax){
				req.session.giohang.splice(i,1);
				break;
			}
		}
	}

	if (q.typess=="them"){
		for (i=0;i<req.session.giohang.length;i++){
			if (req.session.giohang[i].manuochoa==q.manuochoax){
				req.session.giohang[i].soluong++;
				break;
			}
		}
	}


	if (q.typess=="bot"){
		for (i=0;i<req.session.giohang.length;i++){
			if (req.session.giohang[i].manuochoa==q.manuochoax){
				req.session.giohang[i].soluong--;
				if (req.session.giohang[i].soluong==0) {
					req.session.giohang.splice(i,1);
					break;
				}
				break;
			}
		}
	}

	var q = url.parse(req.url, true).query;
	if(q.muanuochoa!=undefined)
	{
		console.log("ABC");
		if (req.session.giohang==undefined)
		{
			console.log("ABC2");
			req.session.giohang=[];
			console.log(req.session.giohang.length);
			var nuochoa={
				manuochoa:q.muanuochoa,
				tennuochoa:q.tennuochoa,
				dongia:q.gianuochoa,
				hinhanh:q.hinhanhnuochoa,
				soluong:parseInt(q.soluongmua)
			};
			req.session.giohang[0]=nuochoa;
			console.log(req.session.giohang.length);
		} else {
			var soluongtronggio=0;
			for (i=0;i<req.session.giohang.length;i++){
				if (req.session.giohang[i].manuochoa==q.muanuochoa){
					req.session.giohang[i].soluong+=parseInt(q.soluongmua);
					soluongtronggio+=req.session.giohang[i].soluong;
					break;
				}
			}
			if (soluongtronggio==0){
				var nuochoa={
					manuochoa:q.muanuochoa,
					tennuochoa:q.tennuochoa,
					dongia:q.gianuochoa,
					hinhanh:q.hinhanhnuochoa,
					soluong:parseInt(q.soluongmua),
				};

				req.session.giohang[req.session.giohang.length]=nuochoa;
			}
		}
	}
}

module.exports.HienThiGioHang =async function(giohang){
	if (giohang==undefined)
	{
		return "<div class=\"beta-select\"><i class=\"fa fa-shopping-cart\"></i> Giỏ hàng (Trống) <i class=\"fa fa-chevron-down\"></i></div>";
	}
	var tongtien=0;
	var soluong=giohang.length;
	var kq="";
	if (soluong==0)
	{
		kq+="<div class=\"beta-select\"><i class=\"fa fa-shopping-cart\"></i> Giỏ hàng (Trống) <i class=\"fa fa-chevron-down\"></i></div>";
		return kq;
	}
	kq+="<div class=\"beta-select\"><i class=\"fa fa-shopping-cart\"></i> Giỏ hàng ("+soluong+") <i class=\"fa fa-chevron-down\"></i></div>";
	kq+="<div class=\"beta-dropdown cart-body\">";
	for (i=0;i<giohang.length;i++){
		kq+= " <div class=\"cart-item\">";

		kq+="<a class=\"cart-item-delete\" >\n" +
			"<button onClick='xoanuochoa(" + giohang[i].manuochoa+")'>    <i class=\"fa fa-times\">\n" +
			"    </i>\n"+"</button>" +
			"</a>";
		kq+="<div class=\"media\">";
		kq+="<a class=\"pull-right\" style=\"padding-left: 25px\" >\n" +
			"    <button onClick='themnuochoa(" + giohang[i].manuochoa+")' ><i class=\"fa fa-plus\"></i></button>   \n" +
			"    <br>\n" +
			"    <br>\n" +
			"    <button onClick='botnuochoa(" + giohang[i].manuochoa+")'><i class=\"fa fa-minus\"></i></button>\n" +
			"</a>";
		kq+="<a class=\"pull-left\" ><img src=\"/images/products/"+giohang[i].hinhanh+"\" alt=\"nuochoa\"height=\"42\" width=\"42\"></a>";
		kq+="<div class=\"media-body\">\n" +
			"<span class=\"cart-item-title\">"+giohang[i].tennuochoa+"</span>";
		kq+="    <span class=\"cart-item-amount\">"+"<b>"+giohang[i].soluong+"</b>"+"x"+"<span>"+giohang[i].dongia+"đồng"+"</span></span>\n" +
			"                                </div></div>\n" +
			"                        </div>";
		tongtien+=giohang[i].soluong*giohang[i].dongia;

	}

	kq+="    <div class=\"cart-caption\">\n" +
		"                            <div class=\"cart-total text-right\">Tổng tiền: <span class=\"cart-total-value\">"+tongtien+"đồng"+"</span></div>\n" +
		"                            <div class=\"clearfix\"></div>\n" +
		"\n" +
		// "                            <form method=\"post\"  action=\"/users\n" + "\n" +
		"                            <div class=\"center\">\n" +
		"                                <div class=\"space10\">&nbsp;</div>\n" +
		"                                <a href=\"/dat-hang\"  class=\"beta-btn primary text-center\">Đặt hàng <i class=\"fa fa-chevron-right\"></i></a>\n" +
		"                            </div>\n" +
		"                            </form>\n " +
		"                        </div>\n" +
		"                    </div>";

		// \"dathang()\"
	return kq;


}

module.exports.dssp1 = async function(n,id){//hien thi sp thoe loại
    var pool = ketnoi();
	var classgrid="col-sm-6 col-md-4 col-lg-3";
	var sosp1hang=4;
	var rs_spmoi = await pool.query("select p.id_loai as maloaisp, p.id, p.name, p.image, p.unit_price, p.promotion_price, loai.name as loai from products p, loainuochoa loai where p.id_loai = loai.id and loai.id=" + id + "  order by p.updated_at DESC");
	var dssp;

		dssp = rs_spmoi[0];
	var code = "";
	if(dssp.length<n)
	n=dssp.length;
    for(i = 0; i < n; i++){
		if(i==0)
			code += "<div class=\"row\">";
		if(i%sosp1hang==0 && i>0)
			code += "<div class=\"space40\">&nbsp;</div><div class=\"row\">";
        code += "<div class=\""+classgrid+"\"><div class=\"single-item\"><a href=\"http://localhost:8000/sanpham/?loaisp="+dssp[i].loai+"&&masanpham="+dssp[i].id+"\"><div class=\"single-item-header\"><img src=\"/images/products/";
        code += dssp[i].image +"\" alt=\"\"></div><div class=\"single-item-body\"><p class=\"single-item-title\">";
		code += dssp[i].name +"</p><p class=\"single-item-price\">";
		if(dssp[i].unit_price == dssp[i].promotion_price)
			code += "<span>"+dssp[i].unit_price+"</span>";
		else 
			code += "<span class=\"flash-del\">"+dssp[i].unit_price+"</span><span class=\"flash-sale\">"+dssp[i].promotion_price+"</span>";
		code += "</p></div></a><div class=\"single-item-caption\"><a class=\"add-to-cart pull-left\" href=\"/loaisanpham/?loaisp="+dssp[i].loai+"&&maloai="+dssp[i].maloaisp +"&muanuochoa="+dssp[i].id+"&tennuochoa="+dssp[i].name+"&soluongmua=1"+"&gianuochoa="+dssp[i].promotion_price+"&hinhanhnuochoa="+dssp[i].image+"\"><i class=\"fa fa-shopping-cart\"></i></a><a class=\"beta-btn primary\" href=\"http://localhost:8000/sanpham/?loaisp="+dssp[i].loai+"&&masanpham="+dssp[i].id+"\">Chi tiết <i class=\"fa fa-chevron-right\"></i></a><div class=\"clearfix\"></div></div></div></div>";
		if((i + 1) % sosp1hang == 0)
            code += "</div>";
	}
    return code;
}
module.exports.find=async function(n,tensp){
	var pool=ketnoi();
	var classgrid="col-sm-6 col-md-4 col-lg-3";
	var sosp1hang=4;
	var result= await pool.query("SELECT * from products where name like'%"+tensp+"%' or description like '%" + tensp +"'");

	var dssp;
	dssp=result[0];
	var code="";
	if(dssp.length<n)
	n=dssp.length;
    for(i = 0; i < n; i++){
		if(i==0)
			code += "<div class=\"row\">";
		if(i%sosp1hang==0 && i>0)
			code += "<div class=\"space40\">&nbsp;</div><div class=\"row\">";
        code += "<div class=\""+classgrid+"\"><div class=\"single-item\"><a href=\"http://localhost:8000/sanpham/?loaisp="+dssp[i].id_loai+"&&masanpham="+dssp[i].id+"\"><div class=\"single-item-header\"><img src=\"/images/products/";
        code += dssp[i].image +"\" alt=\"\"></div><div class=\"single-item-body\"><p class=\"single-item-title\">";
		code += dssp[i].name +"</p><p class=\"single-item-price\">";
		if(dssp[i].unit_price == dssp[i].promotion_price)
			code += "<span>"+dssp[i].unit_price+"</span>";
		else 
			code += "<span class=\"flash-del\">"+dssp[i].unit_price+"</span><span class=\"flash-sale\">"+dssp[i].promotion_price+"</span>";
		code += "</p></div></a><div class=\"single-item-caption\"><a class=\"add-to-cart pull-left\" href=\"/s?search="+ tensp +"&muanuochoa="+dssp[i].id+"&tennuochoa="+dssp[i].name+"&soluongmua=1"+"&gianuochoa="+dssp[i].promotion_price+"&hinhanhnuochoa="+dssp[i].image+"\"><i class=\"fa fa-shopping-cart\"></i></a><a class=\"beta-btn primary\" href=\"http://localhost:8000/sanpham/?loaisp="+dssp[i].id_loai+"&&masanpham="+dssp[i].id+"\">Chi tiết <i class=\"fa fa-chevron-right\"></i></a><div class=\"clearfix\"></div></div></div></div>";
		if((i + 1) % sosp1hang == 0)
            code += "</div>";
	}
    return code;
}

module.exports.HienThiDonHang =async function(giohang){
	var tongtien=0;
	var kq="";
	kq+=`<div class="your-order-head"><h5>Đơn hàng của bạn</h5></div>
	<div class="your-order-body" style="padding: 0px 10px">
		<div class="your-order-item">
			<div>`;



	for (let index = 0; index < giohang.length; index++) {
		kq+=`<div class="media">
		<img width="25%" src="/images/products/${giohang[index].hinhanh}" alt="" class="pull-left">
		<div class="media-body">
			<p class="font-large">${giohang[index].tennuochoa}</p>
			<span class="color-gray your-order-info">Đơn giá: ${giohang[index].dongia} đồng</span>
			<span class="color-gray your-order-info">Số lượng:${giohang[index].soluong}</span>
		</div>
	</div>`;
	tongtien+=giohang[index].soluong*giohang[index].dongia;
		
	}

	kq+=` </div>
	<div class="clearfix"></div>
</div>
<div class="your-order-item">
	<div class="pull-left"><p class="your-order-f18">Tổng tiền:</p></div>
	<div class="pull-right"><h5 class="color-black">${tongtien} đồng</h5></div>
	<div class="clearfix"></div>
</div>
</div>`;

	return kq;


}