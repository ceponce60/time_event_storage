var mysql  = require('mysql');
var dbconn = mysql.createConnection({
  host     : '127.0.0.1',
  user     : 'myusr',
  password : '123456',
  database : 'time'
});

dbconn.connect(function(err){
  if(err){
    console.log('Database connection error');
  }else{
    console.log('Database connection successful');
  }
});

var record= { event: 'this is a test event', start_time: '2018-01-19 03:14:07', end_time: '2015-01-19 03:14:07' };

dbconn.query('INSERT INTO events SET ?', record, function(err,res){
  if(err) throw err;

  console.log('Last record insert id:', res.insertId);
});

dbconn.end(function(err) {
  // Function to close database connection
});
