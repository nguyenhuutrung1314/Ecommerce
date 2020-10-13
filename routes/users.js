var express = require('express');
var router = express.Router();
var url = require('url');
var csdl = require('../xulydulieu/xulysanpham.js');
function ketnoi(){
  var mysql = require('mysql2/promise');
  var pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password:'',
  database: 'quanlybanhang',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
  });
  return pool;
  }
/* GET users listing. */
router.get('/users', function(req, res, next) {
  res.send('sắp hiểu rồi');
  console.log(req.user.id);
});



module.exports = router;