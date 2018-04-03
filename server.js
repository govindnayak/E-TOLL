var
  express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  sql = require('mysql'),
  escape = require('sql-escape'),
  fs = require('fs'),

  port = 3000;

var sqlConfig = {
      user: 'root',
      password: 'Chanakya@198',
      server: 'localhost',
      database: 'toll'
}

var connection = sql.createConnection(sqlConfig);


var server=app.listen(port,function(){
  console.log("Welcome! You're now on PORT " + port);
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));


app.use('/', express.static(__dirname + '/public'));
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

////////////////////////////////////////////////////////////////////

app.post("/login", function(req , res){
  connection.query('select username, password from user WHERE (username = ? AND password = ?)',[req.body.username,req.body.password], function(err, result){

    if(err)
    {
      console.log(err);
      res.send({"success":false , "message":"failed", "status": 0});

    }
    else if(result.length)
    res.send({"success":true , "message":"successful", "status": 1});


    else {
      res.send({"success":false , "message":"failed", "status": 0});

    }

  })
});


app.post("/register", function(req , res){
  connection.query('insert into user values(?, ?, ?, ?, ?, ?, ?)',[req.body.fname,req.body.lname, req.body.username, req.body.password, req.body.age, req.body.dlno, req.body.mobile], function(err, result){

    if(err)
    {
      console.log(err);
      res.send({"success":false , "message":"failed", "status": 0});

    }
    else{
    res.send({"success":true , "message":"successful", "status": 1});

    }

  })
});