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

app.post("/dashboard", function(req, res){
  console.log(req.body.username);
  connection.query("select username, dlno from user WHERE username = ?", [req.body.username], function(err, data){
    if(err)
    {
      console.log("Error while querying database :- " + err);
      res.send(err);
    }
    else {
      res.send(data);
    }
  })
});

app.post('/transactions', function(req, res){
  console.log(req.body.start, req.body.end);
  connection.query("select u.fname, u.lname, t.start, t.end from transactions t, user u where u.dlno = t.dlno and timestamp >= ? and timestamp <= ?", [req.body.start, req.body.end], function(err, data){
    if(err)
    {
      console.log("Error while querying database :- " + err);
      res.send(err);
    }
    else {
      res.send(data);
    }
  })
});

app.post('/update', function(req, res){
  var reg = req.body.reg;
  var loc = req.body.location;
  console.log(reg, loc);
  var date = new Date();
  var timestamp = date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString() + '-' + date.getDate().toString() + ' ' + date.getHours().toString() + ':' + date.getMinutes().toString() + ':' + date.getSeconds().toString();
  connection.query('select id, end from transactions where dlno = ? and end is NULL', [reg], function(err, data){
    if(err)
    {
      console.log("Error while querying database :- " + err);
      res.send(err);
    }
    else {
      if(data.length)
      {
        connection.query('update transactions set end = ? where dlno = ? and end is NULL', [loc, reg], function(err, data){
          if(err)
            res.send(err);
          else {
            console.log('End Location added to reg no: ' + reg);
            res.send('End Location added to reg no: ' + reg);
          }
        });
      }
      else {
        connection.query('insert into transactions (dlno, start, timestamp) values(?, ?, ?)', [reg, loc, timestamp], function(err, data){
          if(err)
            res.send(err);
          else {
            console.log('Start Location added to reg no: ' + reg);
            res.send('Start Location added to reg no: ' + reg);
          }
        });
      }
    }
  })
});