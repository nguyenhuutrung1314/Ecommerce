var express = require('express');
var router = express.Router();
var xuly= require('../xulydulieu/xulysanpham');
 
/* GET home page. */
router.post('/dathang', async function(req, res) {
  //var spmoi = await csdl.soluongsp("select count(id) as num from products where");
  /*if(req.user){
    console.log(req.user.id);
    console.log(req.session.giohang.length);
    
   
  }else{
*/
    console.log(req.body.name);
    console.log(req.body.gender);
    console.log(req.body.email);
    console.log(req.body.address);
    console.log(req.body.phone);
    console.log(req.body.notes);
    console.log(req.body.payment_method)

    var ten=req.body.name;
   var gioitinh=req.body.gender;
    var email=req.body.email;
    var diachi=req.body.address;
   var sdt=req.body.phone;
   var ghichu=req.body.notes;
    var hinhthucthanhtoan=req.body.payment_method;

    

    await xuly.dathang(ten,gioitinh,email,diachi,sdt,ghichu,hinhthucthanhtoan,req.session.giohang);
    req.session.giohang=[];

    //console.log(" XXXX"+req.session.giohang.length);
    
    res.writeHead(200, {'Content-Type': 'text/html;charset=utf-8'});
    res.write(`<script>
    alert(\`Mua hàng thàng công
  Một email đã được gửi vào email của bạn
  Vui lòng đăng nhập email xác nhận để được giao hàng\`);
  window.open("/","_self");
  </script>`);  
    res.end();
 
  
});

module.exports = router;