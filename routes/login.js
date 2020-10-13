
// app.set("view engine", "ejs");
// app.set('views', './views');

// app.use(Passport.initialize());
// app.use(Passport.session())
  var express = require("express"),
  router = express.Router(),
  Passport = require("passport"),
  LocalStrategy = require("passport-local").Strategy

  var url = require('url');
var csdl = require('../xulydulieu/xulysanpham.js');




// default direct for css and html bug not load
var directName = require('../app');
router.use(express.static(directName.dirname + '/public'));
//

router.get('/dangnhap', async function(req, res) {
  console.log("login in routes");
  
  var hienthi= await csdl.Loainuochoa();
  res.render('login',{ message: req.flash('message') ,hienthi:hienthi})
});

router.post('/dangnhap', Passport.authenticate('local', {
  successRedirect: '/checkLogin',
  failureRedirect: '/dangnhap',
  failureFlash: true
}));



router.get('/checkLogin', function(req, res) {
  if (req.user.phanquyen != 1) {
    res.redirect("/");
  }
  if (req.user.phanquyen == 1) {
    res.redirect("/admin");
  }
});

router.get('/logout',function(req,res,next){
    if(req.session){
      req.session.destroy(function(err){// xóa session đăng nhập
        if(err){
          return next (err);  // nếu lỗi thì báo 

        }else{
          return res.redirect('/')// thành công thì về trang hủ 
        }
      });
    }
})

module.exports = router;



