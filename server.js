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

var request1 = require('request');
var path = require('path');
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
  connection.query('insert into user values(?, ?, ?, ?, ?, ?, ?, ?)',[req.body.fname,req.body.lname, req.body.username, req.body.password, req.body.age, req.body.dlno, req.body.mobile , req.body.regno], function(err, result){

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
  console.log(req.body.start, req.body.end,req.body.userid);
  connection.query("select u.fname, u.lname, t.start, t.end, t.cost from transactions t, user u where u.regno = t.regno and timestamp >= ? and timestamp <= ? and t.username = ?", [req.body.start, req.body.end , req.body.userid], function(err, data){
    if(err)
    {
      console.log("Error while querying database :- " + err);
      res.send(err);
    }
    else {
      console.log(data);
      res.send(data);
    }
  })
});

app.post('/ocr', function(req, res){
  var regno;
  var loc = req.body.location;

  console.log("here");
  console.log(req.body);
  console.log(loc);
  var date = new Date();
  var timestamp = date.getFullYear().toString() + '-' + (date.getMonth() + 1).toString() + '-' + date.getDate().toString() + ' ' + date.getHours().toString() + ':' + date.getMinutes().toString() + ':' + date.getSeconds().toString();
  var dst_path = path.resolve(__dirname + '/final.jpg');
  var data = {
              "requests": [
                {
                  "image": {
                    "content": new Buffer(fs.readFileSync(dst_path)).toString("base64")
                  },
                  "features": [
                    {
                      "type": "TEXT_DETECTION"
                    }
                  ]
                }
              ]
            }
    request1.post('https://vision.googleapis.com/v1/images:annotate?key=AIzaSyAmPP-Jzyti3JZo1Emtx_mRIVVzsC6hHt4',
              { json: data },
              function (error, response, body) {
                if(error) console.log(error);
                else
                {
                  regno = body.responses[0].textAnnotations[0].description;
                  regno = regno.substring(0, regno.length - 1);
                  console.log(body.responses[0].textAnnotations[0].description);



/////////////

console.log("regno:" + regno);
var number = regno
connection.query('select username from user where regno = ? ', [regno], function(err, userids){
  if(err)
  {
    console.log("herer2");
    console.log("Error while querying database :- " + err);
    res.send(err);
  }
  else{
  if(userids.length==0)
    {
      console.log("no match found for username and vehicle");
      return res.send("no match found");
    }
    var userid = userids[0].username;
  connection.query('select username,start,end from transactions where regno = ? and end is NULL', [regno], function(err, data){
  if(err)
  {
    console.log("herer1");
    console.log("Error while querying database :- " + err);
    res.send(err);
  }
  else {
    if(data.length)
    {

      var s = data[0].start;
      // var e = data[0].end;
      connection.query('select cost from costs where start = ? and end = ?', [s , loc], function(err, data){
          if(err)
          {
            console.log(err);
            res.send(err);
          }
          else{
            if(!data.length)
                cost =  0;
            else
              {cost = data[0].cost;}
              connection.query('update transactions set end = ?,cost = ? where regno = ? and end is NULL', [loc, cost, regno], function(err, data){
                if(err){
                  console.log("herer3");
                  console.log(err);
                  res.send(err);
                }
                else {
                  console.log('End Location added to reg no: ' + regno);
                  res.send('End Location added to reg no: ' + regno);
                }
              });
            }
            });

    }
    else {
      connection.query('insert into transactions (username, regno, start, timestamp) values(? , ?, ?, ?)', [userid , regno, loc, timestamp], function(err, data){
        if(err)
          {
            console.log("herer4");
            console.log(err);
            res.send(err);}
        else {
          console.log('Start Location added to reg no: ' + regno);
          res.send('Start Location added to reg no: ' + regno);
        }
      });
    }
  }
})
}
})




///////////////
                }
          })


});