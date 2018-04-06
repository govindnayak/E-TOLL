create table user(fname varchar(20), lname varchar(20), username varchar(50) primary key, password varchar(50), age int(11), dlno varchar(50), mobile varchar(10), regno varchar(10));

create table costs(start varchar(50), end varchar(50), cost float, primary key(start, end));

create table transactions(username varchar(50) not null, regno varchar(50), start varchar(50), end varchar(50) default NULL, timestamp datetime, primary key(username, timestamp));
