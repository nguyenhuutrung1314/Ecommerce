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
module.exports.loaisp=async function(id){
	var pool=ketnoi();
	var result=await pool.query ("select (b.unit_price*b.quantity) as sum from bill_detail b, products p,loainuochoa l where b.id_product = p.id and p.id_loai = l.id and p.id_loai ="+id);
	// ,function(err,result){
	// if(err) console.log("lỗi");
	// else console.log(result[0][0]);
	// });
	return result[0][0];
}

module.exports.danhsachsanpham = async function(){
	var pool = ketnoi();
    var dssp = await pool.query(`SELECT p.id as id, p.name as name, loai.name as loai FROM products p, loainuochoa loai where p.id_loai = loai.id`);
	var code = "";
	for(var i=0; i<dssp[0].length; i++){
		code += `<tr>
		<td>${dssp[0][i].name}</td>
		<td>${dssp[0][i].loai}</td>
		<td><a href="updateProduct?masanpham=${dssp[0][i].id}">Chi Tiết</a></td>            
	  </tr>`;
	}
	return code;
}

module.exports.findproduct = async function(id){
	var pool = ketnoi();
	var rs = await pool.query("select * from products where id = "+id);
	return rs[0][0];
}

module.exports.findbill = async function(id){
	var pool = ketnoi();
	var rs = await pool.query("select bills.id, name, date_order, payment, bills.note, trangthai from bills, customer where bills.id_customer = customer.id and bills.id = "+id);
	return rs[0][0];
}

module.exports.arrayloaisp = async function(){
	var dsloaisp = [];
	var pool = ketnoi();
	var rsdsloai = await pool.query("select id, name from loainuochoa");
	rsdsloai = rsdsloai[0];
	for(i=0; i<rsdsloai.length; i++){
		dsloaisp.push({id: rsdsloai[i].id, name: rsdsloai[i].name});
	}
	return dsloaisp;
}

module.exports.arraythuonghieu = async function(){
	var dsthuonghieu = [];
	var pool = ketnoi();
	var rsdsthuonghieu = await pool.query("select id, name from thuonghieu");
	rsdsthuonghieu = rsdsthuonghieu[0];
	for(i=0; i<rsdsthuonghieu.length; i++){
		dsthuonghieu.push({id: rsdsthuonghieu[i].id, name: rsdsthuonghieu[i].name});
	}
	return dsthuonghieu;
}

module.exports.arraytrangthai = async function(){
	var dstrangthai = [];
	var pool = ketnoi();
	var rsdstrangthai = await pool.query("select distinct trangthai from bills");
	rsdstrangthai = rsdstrangthai[0];
	for(i=0; i<rsdstrangthai.length; i++){
		dstrangthai.push({name: rsdstrangthai[i].trangthai});
	}
	return dstrangthai;
}

module.exports.updateProduct = async function(value){
	var pool = ketnoi();
	await pool.query('update products SET name = ?, id_thuonghieu = ?, id_loai = ?, gioitinh = ?, unit_price = ?, promotion_price = ?, description = ?, updated_at = ?, image = ? where id = ?', value, function(err, result){
		if(err) console.log("lỗi");
		else console.log("cập nhật sản phẩm thành công");
	});
}

module.exports.danhsachkhachhang = async function(){
	var pool = ketnoi();
    var dskh = await pool.query(`SELECT bills.id as id,name,sum(total)as doanhthu FROM customer,bills WHERE bills.id=customer.id GROUP by name `);
	var code = "";
	for(var i=0; i<dskh[0].length; i++){
		code += `<tr>
		<td>${dskh[0][i].name}</td>
		<td>${dskh[0][i].doanhthu}</td>
		<td><a href="/admin/chitiethoadonkh/?tenkh=${dskh[0][i].name}">Chi Tiết</a></td>               
	  </tr>`;
	}
	return code;
}
/*
module.exports.danhsachhoadonkhachhang = async function(tenkh){
var pool = ketnoi();
var dshd = await pool.query(`SELECT bills.id as id,sum(total)as doanhthu,date_order as ngaymuahang FROM customer,bills WHERE  name='${tenkh}' and bills.id=customer.id group by date_order
//	ORDER BY  date_order ASC`);
	var code = "";
for(var i=0; i<dshd[0].length; i++){
	code += '<tr>';
		
var ngaymuahang=dshd[0][i].ngaymuahang;
	  var tongtien=dshd[0][i].doanhthu;
	  var id=dshd[0][i].id;
	  code+=`<td>${ngaymuahang}</td><td>`;
var tongtien=0;
	  var chitiethoadon = await pool.query(`SELECT products.name as name,quantity as soluong,promotion_price as giasp FROM bill_detail,products WHERE id_bill=${id} and products.id=bill_detail.id_product`);
	  for (let index = 0; index < chitiethoadon[0].length; index++) {
		  code+=`${index+1}.&nbsp&nbsp${chitiethoadon[0][index].name} <br>&nbsp&nbsp&nbsp&nbsp&nbspSố lượng: ${chitiethoadon[0][index].soluong}, Đơn giá: ${chitiethoadon[0][index].giasp} <br>`;
		  tongtien+=chitiethoadon[0][index].soluong*chitiethoadon[0][index].giasp;
	  }
	  code+=`</td>`
	  code+=`<td>${tongtien}</td></tr>`;
	}
	return code;
}*/
module.exports.danhsachhoadonkhachhang = async function(tenkh){
	var pool = ketnoi();
    var dshd = await pool.query(`SELECT bills.id as id,sum(total)as doanhthu,date_order as ngaymuahang FROM customer,bills WHERE  name='${tenkh}' and bills.id=customer.id group by date_order
	ORDER BY  date_order ASC`);
	var code = "";
	for(var i=0; i<dshd[0].length; i++){
		code += '<tr>';
		
	  var ngaymuahang=dshd[0][i].ngaymuahang;
	  var id=dshd[0][i].id;
	  code+=`<td>${ngaymuahang}</td><td>`;
	  var tongtien=0;
	
	  var chitiethoadon = await pool.query(`SELECT products.name as name,quantity as soluong,promotion_price as giasp FROM bill_detail,products WHERE id_bill=${id} and products.id=bill_detail.id_product`);
	  for (let index = 0; index < chitiethoadon[0].length; index++) {
		  code+=`${index+1}.&nbsp&nbsp${chitiethoadon[0][index].name} <br>&nbsp&nbsp&nbsp&nbsp&nbspSố lượng: ${chitiethoadon[0][index].soluong}, Đơn giá: ${chitiethoadon[0][index].giasp} <br>`;
			 tongtien+=chitiethoadon[0][index].soluong*chitiethoadon[0][index].giasp;
	 }
	  code+=`</td>`
	  code+=`<td>${tongtien}</td></tr>`;
	}
	return code;
}


	  
module.exports.danhsachdonhang = async function(){
	var pool = ketnoi();
    var dsdh = await pool.query(`SELECT bills.id as id_bill, name, date_order, trangthai FROM customer, bills WHERE bills.id_customer=customer.id`);
	var code = "";
	for(var i=0; i<dsdh[0].length; i++){
		code += `<tr>
		<td>${dsdh[0][i].name}</td>
		<td>${dsdh[0][i].date_order}</td>
		<td>${dsdh[0][i].trangthai}</td>
		<td><a href="/admin/chitietdonhang/?madonhang=${dsdh[0][i].id_bill}">Chi Tiết</a></td>               
	  </tr>`;
	}
	return code;
}

module.exports.chitietdonhang = async function(id){
	var pool = ketnoi();
    var dssp = await pool.query(`SELECT products.name as name, promotion_price as giasp, quantity as soluong FROM bill_detail, products WHERE id_bill=${id} and products.id=bill_detail.id_product`);
	var code = "";
	var tongtien = 0;
	for(var i=0; i<dssp[0].length; i++){
		code += `<tr>
		<td>${dssp[0][i].name}</td>
		<td style = "text-align: right">${dssp[0][i].giasp}</td>
		<td style = "text-align: right">${dssp[0][i].soluong}</td>
		<td style = "text-align: right">${dssp[0][i].giasp * dssp[0][i].soluong}</td>             
	  </tr>`;
		tongtien += dssp[0][i].giasp * dssp[0][i].soluong;
	}
	return [code, tongtien];
}

module.exports.loaisp=async function(id){
	var pool=ketnoi();
	var count=0;
	var result=await pool.query ("select SUM(b.unit_price*b.quantity) as sum from bill_detail b, products p,loainuochoa l where b.id_product = p.id and p.id_loai = l.id and p.id_loai ="+id);
	// ,function(err,result){
	// if(err) console.log("lỗi");
	// else console.log(result[0][0]);
	// });
	count=result[0][0].sum;
	
	// console.log(result[0][0].sum);
	return count;
}
// module.exports.loaisp=async function(tong,id){
// 	var pool=ketnoi();
// 	var count=0;
// 	var result=await pool.query ("select (b.unit_price*b.quantity) as sum from bill_detail b, products p,loainuochoa l where b.id_product = p.id and p.id_loai = l.id and p.id_loai ="+id);
// 	// for (i=0;i<result.length;i++)
// 	// 	{count=result[0][i].sum;
// 	count=result[0][0].sum;
// 			console.log(count+'ưadksjdnawd');
// 	// console.log(result[0][0].sum);
// 	return count;
// }

module.exports.tongdoanhso=async function(){
	var pool =ketnoi();
	var tongket={
		nuochoanhapkhau:0,
		nuochoanoi : 0,
		nuochoacongso : 0,
		nuochoadulich : 0,	
	}
	// var danhsach= await pool.query('select (b.unit_price*b.quantity)as Sum from bill_detail b')
	// var kq=danhsach[0];
	// for(i=0;i<kq.length;i++){
	// var code=kq[i].Sum;
	tongket["nuochoanhapkhau"] +=parseInt(await this.loaisp(1));
	// console.log(tongket["nuochoanhapkhau"]);
	tongket["nuochoanoi"] += parseInt(await this.loaisp(2));
	// // console.log(tongket["nuochoanoi"]);
	tongket["nuochoacongso"] += parseInt(await this.loaisp(3));
	// // console.log(tongket["nuochoacongso"]);
	tongket["nuochoadulich"] +=parseInt(await this.loaisp(4));
	// console.log(tongket["nuochoadulich"]);

	var sum=0;
	for(var each in tongket){
		sum+=tongket[each]
		console.log(sum)// tính tổng doanh thu
	}
	var result ={
		tongsp:sum,// tổng doanh thu
		tongket:tongket,
	
	}
	return result ;

}

module.exports.loaisptheongay=async function(ngay,thang,nam,id){
	var pool=ketnoi();
	
	var count=0;
	var result=await pool.query ("select SUM(b.unit_price*b.quantity) as sum from bill_detail b, products p,loainuochoa l where b.id_product = p.id and p.id_loai = l.id and p.id_loai ='" + id + "'" + "and day(b.created_at)='"+ ngay+"'" +"and month(b.created_at)='"+thang+"'"+"and year(b.created_at)="+nam);
	count=result[0][0].sum;
	
	// console.log(result[0][0].sum);
	return count;
}


module.exports.doanhthungay=async function(str){
	var tongket={
		nuochoanhapkhau:0,
		nuochoanoi : 0,
		nuochoacongso : 0,
		nuochoadulich : 0,	
	}
	var ngay = str[8]+str[9];
    var thang = str[5]+str[6];
	var nam = str[0]+str[1]+str[2]+str[3];
	
	console.log(ngay+" "+thang+" "+nam+ "chính là ngày thags");
	tongket["nuochoanhapkhau"] +=await this.loaisptheongay(ngay,thang,nam,1);
	// console.log(tongket["nuochoanhapkhau"]);
	tongket["nuochoanoi"] += await this.loaisptheongay(ngay,thang,nam,2);
	// // console.log(tongket["nuochoanoi"]);
	tongket["nuochoacongso"] += await this.loaisptheongay(ngay,thang,nam,3);
	// // console.log(tongket["nuochoacongso"]);
	tongket["nuochoadulich"] +=await this.loaisptheongay(ngay,thang,nam,4);
	// console.log(tongket["nuochoadulich"]);

	var sum=0;
	for(var each in tongket){
		sum+=tongket[each]
		console.log(sum)// tính tổng doanh thu
	}
	var result ={
		tongsp:sum,// tổng doanh thu
		tongket:tongket,
	
	}
	return result ;
}

module.exports.loaisptheothang=async function(thang,nam,id){
	var pool=ketnoi();
	
	var count=0;
	var result=await pool.query ("select SUM(b.unit_price*b.quantity) as sum from bill_detail b, products p,loainuochoa l where b.id_product = p.id and p.id_loai = l.id and p.id_loai ='" + id + "'" + "and month(b.created_at)='"+thang+"'"+"and year(b.created_at)="+nam);
	count=result[0][0].sum;
	
	// console.log(result[0][0].sum);
	return count;
}
module.exports.doanhthuthang=async function(str){
	var tongket={
		nuochoanhapkhau:0,
		nuochoanoi : 0,
		nuochoacongso : 0,
		nuochoadulich : 0,	
	}
	var ngay = str[8]+str[9];
    var thang = str[5]+str[6];
	var nam = str[0]+str[1]+str[2]+str[3];
	
	console.log(ngay+" "+thang+" "+nam+ "chính là ngày thags");
	tongket["nuochoanhapkhau"] +=await this.loaisptheothang(thang,nam,1);
	// console.log(tongket["nuochoanhapkhau"]);
	tongket["nuochoanoi"] += await this.loaisptheothang(thang,nam,2);
	// // console.log(tongket["nuochoanoi"]);
	tongket["nuochoacongso"] += await this.loaisptheothang(thang,nam,3);
	// // console.log(tongket["nuochoacongso"]);
	tongket["nuochoadulich"] +=await this.loaisptheothang(thang,nam,4);
	// console.log(tongket["nuochoadulich"]);

	var sum=0;
	for(var each in tongket){
		sum+=tongket[each]
		console.log(sum)// tính tổng doanh thu
	}
	var result ={
		tongsp:sum,// tổng doanh thu
		tongket:tongket,
	
	}
	return result ;
}
module.exports.loaisptheonam=async function(nam,id){
	var pool=ketnoi();
	
	var count=0;
	var result=await pool.query ("select SUM(b.unit_price*b.quantity) as sum from bill_detail b, products p,loainuochoa l where b.id_product = p.id and p.id_loai = l.id and p.id_loai ='" + id + "'" + "and year(b.created_at)="+nam);
	count=result[0][0].sum;
	
	// console.log(result[0][0].sum);
	return count;
}
module.exports.doanhthunam=async function(str){
	var tongket={
		nuochoanhapkhau:0,
		nuochoanoi : 0,
		nuochoacongso : 0,
		nuochoadulich : 0,	
	}
	var ngay = str[8]+str[9];
    var thang = str[5]+str[6];
	var nam = str[0]+str[1]+str[2]+str[3];
	
	console.log(ngay+" "+thang+" "+nam+ "chính là ngày thags");
	tongket["nuochoanhapkhau"] +=await this.loaisptheonam(nam,1);
	// console.log(tongket["nuochoanhapkhau"]);
	tongket["nuochoanoi"] += await this.loaisptheonam(nam,2);
	// // console.log(tongket["nuochoanoi"]);
	tongket["nuochoacongso"] += await this.loaisptheonam(nam,3);
	// // console.log(tongket["nuochoacongso"]);
	tongket["nuochoadulich"] +=await this.loaisptheonam(nam,4);
	// console.log(tongket["nuochoadulich"]);

	var sum=0;
	for(var each in tongket){
		sum+=tongket[each]
		console.log(sum)// tính tổng doanh thu
	}
	var result ={
		tongsp:sum,// tổng doanh thu
		tongket:tongket,
	
	}
	return result ;
}

module.exports.addProduct = async function(value){
	var pool = ketnoi();
	await pool.query('insert into products (name, id_thuonghieu, id_loai, gioitinh, description, unit_price, promotion_price, image, created_at, updated_at) value (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', value, function(err, result){
		if(err) console.log("lỗi");
		else console.log("cập nhật sản phẩm thành công");
	});
}

module.exports.updateBill = async function(value){
	var pool = ketnoi();
	await pool.query('update bills SET trangthai = ? where id = ?', value, function(err, result){
		if(err) console.log("lỗi");
		else console.log("cập nhật sản phẩm thành công");
	});
}
