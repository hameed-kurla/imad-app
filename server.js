var express = require('express');
var morgan = require('morgan');
var path = require('path');
var Pool =require('pg').Pool;
var crypto = require('crypto');
var bodyParser = require('body-parser');

var app = express();
app.use(morgan('combined'));
app.use(bodyParser.json());



var config = {
                user: 'hameedkurla',
                database: 'hameedkurla', 
                host: 'db.imad.hasura-app.io',
                port: '5432',
                password: process.env.DB_PASSWORD
            };

var pool= new Pool(config);

app.get('/users', function (req, res) {
  pool.query('SELECT * FROM users',function(err,result){
      if (err){
          res.status(500).send(err.toString());
      }
      else{
          res.send(JSON.stringify(result.rows));
      }
  })
});

function generatehash(inputString,saltValue){
    
    var returnValue = crypto.pbkdf2Sync(inputString,saltValue,10000,512,'sha512');
    return ['pbkd2',saltValue,10000,returnValue.toString('hex')].join('$');

}

app.get('/hash/:inputString', function (req, res) {
    var saltValue = 'some salt to hash';
    var hashedString = generatehash(req.params.inputString,saltValue);
    res.send(hashedString);
});

app.post('/login', function (req, res) {
/* curl -v -XPOST -H 'Content-Type: application/json' --data '{"username": "Shazia", "password": "Husssain"}' http://hameedkurla.imad.hasura-app.io/login*/
    var username= req.body.username;
    var password= req.body.password;
    pool.query('SELECT * FROM users where username=$1',[username],function(err,result){
      if (err){
          res.status(500).send(err.toString());
      }
       else{
            if (result.rows.length===0) {
                res.status(403).send('User Not Found');
            }
            else{
                dbString = result.rows[0].password;
                saltValue = dbString.split('$')[1];
                hashedPassword = generatehash(password,saltValue);
                if (dbString === hashedPassword){
                    res.send('Login Success');
                }
                else{
                    res.status(403).send('Password is Incorrect');
                }
            }
       }
    });
});

app.post('/create-user', function (req, res) {
/* curl -v -XPOST -H 'Content-Type: application/json' --data '{"username": "Hameed", "password": "Husssain", "email": "hameed.kurla@gmail.com"}' http://hameedkurla.imad.hasura-app.io/create-user*/
    var username= req.body.username;
    var password= req.body.password;
    var email= req.body.email;
    var saltValue = crypto.randomBytes(128).toString('hex');
    var hashedString = generatehash(password,saltValue);
    pool.query('INSERT into "users"(username,password,email) VALUES ($1,$2,$3)',[username,hashedString,email],function(err,result){
      if (err){
          res.status(500).send(err.toString());
      }
      else{
          res.send('User Created Successfully');
      }
    });
});

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'index.html'));
});


var artcles={
		artcleOne: {
					title: `Welcome To Artcle One! Hameed Hussain`,
					heading:`Artcle One! Web Development`,
					content: `<p>
								My name is Hameed and I am your Web Developer. This is the content of my first Article.My name is Hameed and I am your Web Developer. This is the content of my first Article.My name is Hameed and I am your Web Developer. This is the content of my first Article.
							</p>
							<p>
								My name is Hameed and I am your Web Developer. This is the content of my first Article.My name is Hameed and I am your Web Developer. This is the content of my first Article.My name is Hameed and I am your Web Developer. This is the content of my first Article.
							</p>
							<p>
								My name is Hameed and I am your Web Developer. This is the content of my first Article.My name is Hameed and I am your Web Developer. This is the content of my first Article.My name is Hameed and I am your Web Developer. This is the content of my first Article.
							</p>
							<p>
								My name is Hameed and I am your Web Developer. This is the content of my first Article.My name is Hameed and I am your Web Developer. This is the content of my first Article.My name is Hameed and I am your Web Developer. This is the content of my first Article.
							</p>`
				},
		artcleTwo: {
					title: `Welcome To Artcle Two! Hameed Hussain`,
					heading:`Artcle Two! Web Development`,
					content: `<p>
								My name is Hameed and I am your Web Developer. This is the content of my first Article.My name is Hameed and I am your Web Developer. This is the content of my first Article.My name is Hameed and I am your Web Developer. This is the content of my first Article.
							</p>
							<p>
								My name is Hameed and I am your Web Developer. This is the content of my first Article.My name is Hameed and I am your Web Developer. This is the content of my first Article.My name is Hameed and I am your Web Developer. This is the content of my first Article.
							</p>
							<p>
								My name is Hameed and I am your Web Developer. This is the content of my first Article.My name is Hameed and I am your Web Developer. This is the content of my first Article.My name is Hameed and I am your Web Developer. This is the content of my first Article.
							</p>
							<p>
								My name is Hameed and I am your Web Developer. This is the content of my first Article.My name is Hameed and I am your Web Developer. This is the content of my first Article.My name is Hameed and I am your Web Developer. This is the content of my first Article.
							</p>`
				}
};

function createHtmltemplate(data){
	var title=data.title;
	var heading=data.heading;
	var content=data.content;
	var htmltemplate=`
			<!doctype html>
			<html>
				<head>
					<title>
						${title}
					</title>
					<meta name="viewport" content="width-device-width, initial-scale=1">
					<link href="/ui/style.css" rel="stylesheet" /> 
				</head>
				<body>
					<div class="container">
						<div class="center">
							<img src="/ui/madi.png" class="img-medium"/>
						</div>
						<div>
							<a href="/">Home</a>
						</div>
						<br>
						${heading}
						<div>
							${content}
						</div>
					</div>
				</body>
			</html>`;
	return htmltemplate;
}


/*
app.get('/artcle-two', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'artcle-two.html'));
});*/

app.get('/:artcleName', function (req, res) {
	//The Above paramter :artcleName brings artcle name(localhost:8080/artclename)
	var artcleNameValue = req.params.artcleName;
	res.send(createHtmltemplate(artcles[artcleNameValue]));
});

app.get('/artcles/:artcleName',function(req,res){
    
    var artcleNameValue = req.params.artcleName;
   
    //pool.query("SELECT title,heading,content FROM artcles where artclename = " + artcleNameValue,function(err,result){
    //pool.query("SELECT title,heading,content FROM artcles where artclename = '" + artcleNameValue+"'",function(err,result){
   
    pool.query("SELECT title,heading,content FROM artcles where artclename = $1", [artcleNameValue],function(err,result){
        if (err){
            res.status(500).send(err.toString());
        }
        else{
            if (result.rows.length===0) {
                res.status(404).send('Artcle Not Foun');
            }
            else{
                artcleData = result.rows[0];
                res.send(createHtmltemplate(artcleData));
            }
        }
    });
});

var counter = 0;
app.get('/counter', function (req, res) {
  counter= counter + 1;
  res.send(counter.toString());
});

app.get('/getcount', function (req, res) {
  res.send(counter.toString());
});


app.get('/ui/main.js', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'main.js'));
});

app.get('/ui/style.css', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'style.css'));
});

app.get('/ui/madi.png', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'madi.png'));
});


// Do not change port, otherwise your app won't run on IMAD servers
// Use 8080 only for local development if you already have apache running on 80

var port = 80;
app.listen(port, function () {
  console.log(`IMAD course app listening on port ${port}!`);
});
