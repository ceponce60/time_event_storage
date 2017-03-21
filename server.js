var http = require('http');
var fs = require('fs');
var formidable = require("formidable");
var util = require('util');


var server = http.createServer(function (req, res) {
    if ( req.connection.parser.incoming.url == "/hereiamfindme") {
	displayData(res);
    } else if (req.method.toLowerCase() == 'get') {
	console.log(req.connection.parser.incoming.url);
        displayForm(res);
    } else if (req.method.toLowerCase() == 'post') {
        processAllFieldsOfTheForm(req, res);
    }

});

function displayForm(res) {
    fs.readFile('form.html', function (err, data) {
        res.writeHead(200, {
            'Content-Type': 'text/html',
                'Content-Length': data.length
        });
        res.write(data);
        res.end();
    });
}

function processAllFieldsOfTheForm(req, res) {
    var form = new formidable.IncomingForm();

    form.parse(req, function (err, fields) {

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

	var record= fields
      
	dbconn.query('INSERT INTO events SET ?', record, function(err,res){
  	  if(err) throw err;

  	  console.log('Last record insert id:', res.insertId);
	});

	dbconn.end(function(err) {
	});	

        res.writeHead(200, {
            'content-type': 'text/plain'
        });
        res.write('received the data:\n\n');
        res.end(util.inspect({
            fields: fields
        }));
    });
}

function displayData(res) {
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


        dbconn.query('SELECT * FROM events;', function(err,db_res){
          if(err) throw err;

	  res.setHeader('Content-Type', 'application/json');
	  res.write(JSON.stringify(db_res));
	  res.end();
        });


        dbconn.end(function(err) {
        });
}

server.listen(1185);
console.log("server listening on 1185");

