var mysql = require('mysql');
var express = require('express');
var session = require('express-session');
var mysqlDbConnection = require('./mysqlDbConnection');
var app = express();


bodyParser =require('body-parser'),

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); 

app.use(express.static('public'));
app.use(session({secret : 'ssshhh'}));

var userSession;

app.get('/' ,function(req,res){
	userSession = req.session;

	if(userSession.userName) {
		res.redirect('/addproduct');
	}else{
		res.sendFile(__dirname + "/" + "login.html")
	}
	
});
app.get('/success',function(req,res){
	res.sendFile(__dirname + "/" + "success.html")
});

app.get('/dashboard',function(req,res){
	res.sendFile(__dirname + "/" + "dashboard.html" )
});

app.get('/searchProduct',function(req,res){

	var htmlStartSTring = "<html><body>";
	
	var htmlEndString = "</table></body></html>";

	var htmlBodyString = "<table><tr><th>Product Name</th> <th>Product Description</th><th>Product price</th></tr>";
	var productInfoString = "";
	var con = mysqlDbConnection.dbConnection();
	con.connect(function(err){
		if(err){
			throw err;
		}else{
			console.log("Mysql connection is successful for add product.!");
			var sql = "select * from products";
			console.log(sql);
			con.query(sql,function(err,result,fields){
				if(err){
					throw err;
				}else{
					//console.log("Product Has been added successfully" + result.length);
					var buffer = "";
					for(var i=0; i<result.length;i++) {
						productInfoString = "<tr><td>" + result[i].productCategory + "</td><td>" + result[i].productManufacturer + "</td><td>" + result[i].productCost + "</td></tr>";
						buffer += productInfoString;
						//console.log(i + "........ " + result[i].productCategory)
					}
					//console.log( ">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>    " + buffer)
					htmlString = htmlStartSTring + htmlBodyString + buffer + htmlEndString;
					res.write(htmlString);
				}
			})
		}
	})

	
});



app.get('/loginfailed',function(req,res){
	res.sendFile(__dirname + "/" + "login_failed.html" )
});

/*********************Start User Login***********************/

app.get('/login',function(req,res){
			// Prepare out put in JSON format
			userSession = req.session;

			//response = {
			    userName = req.query.userName;
				password = req.query.password;

				//console.log("Username is:" + userName + " "+ "User password is :" + password);
			//}
			//console.log(response);
			//res.redirect("/success");
		var con = mysqlDbConnection.dbConnection();
		con.connect(function(err){
			if(err){
				throw err;
			}
			console.log("Connection with mysql is successful.");
			var sql = "SELECT * FROM users where uname ='" + userName + "' &&  upassword ='" + password + "' ;"
			//console.log(sql);
			con.query(sql,function(err,result,fields){
				//console.log(result);
				if(err){
					throw err;
				}
				console.log("Query Executed successfully.!");
				console.log(result);
				if(result.length == 1){
				console.log("Hey your login is successfull.!");
				console.log("You are redirected to the dashboard");
				//res.send("Welcome " + userName);
				userSession.userName = userName;
				res.redirect("/addproduct");
				
				}else{
					console.log("Your user name password not matched");
					res.redirect('loginfailed');

					}
				});

		});
});

/*****************************End user Login*******************/
/*****************************Start user Logout*******************/
app.get('/logout' , function(req,res){
	userSession = req.session;
	req.session.destroy(function(err){
		if(err){
			throw err;
		}else{
			console.log("Session is destroyed, You are redirected to the login page.");
			res.sendFile(__dirname + "/" + "login.html")
		}
	});

});
/*****************************End User Logout*********************/


app.get('/addproduct', function(req,res){
	res.sendFile(__dirname + "/" + "addProduct.html" )
	//var uname = "aaaaaaa";
	//res.render(__dirname + '/addProduct.html',{uname:userSession.userName});

});



app.post('/addproductRequest',function(req, res){
	res.setHeader('Content-Type', 'text/plain');



	/*
			productCategory= req.query.productCategory || null,
			productManufacturer= req.query.productManufacturer || null,
			productDescription= req.query.productDescription || null,
			productCost= req.query.productCost || null,
			productQuantity= req.query.productQuantity || null,
			productSpecification= req.query.productSpecification || null*/



	productCategory = req.body.productCategory,
	productManufacturer = req.body.productManufacturer,
	productDescription = req.body.productDescription,
	productCost = req.body.productCost,
	productQuantity = req.body.productQuantity;
	productSpecification = req.body.productSpecification
	//}));
	//console.log(productOtherSpecifiaction);

	/***************Connection with database Start****************/
	var con = mysqlDbConnection.dbConnection();
	con.connect(function(err){
		if(err){
			throw err;
		}else{
			console.log("Mysql connection is successful for add product.!");
			//res.redirect("/success");
			//create table products(product_id int not null auto_increment primary key,productCategory varchar(20),productManufacturer varchar(20),
//productDescription varchar(20),productCost varchar(20),productQuantity varchar(20),productOtherSpecifiaction varchar(50));
			console.log(productCategory);
			console.log(productManufacturer);
			console.log(productDescription);
			console.log(productCost);
			console.log(productQuantity);	
			var sql = "insert into products (productCategory,productManufacturer,productDescription,productCost,productQuantity,productOtherSpecifiaction) values('"+productCategory+"','"+productManufacturer+"','"+productDescription+"','"+productCost+"','"+productQuantity+"','"+productSpecification+"')";
			console.log(sql);
			con.query(sql,function(err,result,fields){
				if(err){
					throw err;
				}else{
					console.log("Product Has been added successfully");
					res.redirect("/dashboard");
				}
			})
		}
	})
})

app.get('/login_failed',function(req,res){
	res.sendFile(__dirname + "/" + "login_failed.html")
});

app.get('/forgetpasswordrequest',function(req,res){
	res.setHeader('Content-Type' , 'text/plain');
	userName = req.query.userName;
	
	var con = mysqlDbConnection.dbConnection();
	con.connect(function(err){
		if(err){
			throw err;
		}else
		console.log('You have connected with mysql database for password retreive');
		var sql = "select * from users where uname ='" + userName + "' ";
		console.log(sql);
		
		con.query(sql,function(err, result, fields){
			if(err){
				throw err;
			}

			console.log(result);
			
			//console.log(result.length);
			if(result.length >= 1){

				console.log("Your Username has matched");
				
				//res.redirect('/getusername');
				//res.writeHead(200,{'content-Type':'text/html'});
				res.send( "Your User Name is: " + result[0].uname + " " + " " + "Your Password is: " + result[0].upassword );
				//res.end();
			}
			else{
				console.log("User Name does exists. Please create account.");
				res.redirect('/registerHere');
				
				}
			
		});
	});
});

app.get('/getusername',function(req,res){
	res.sendFile(__dirname + "/" + "userGetRequest.html");
});

/**********************User Registration Start************************/

app.get('/registerHere',function(req,res){
	res.sendFile(__dirname + "/" + "registerHere.html");
});

app.post('/userRegistration', function(req,res){
	res.setHeader('content-Type','text/html');

	userName = req.body.username;
	userpass = req.body.password;

	var con = mysqlDbConnection.dbConnection();
	con.connect(function(err){
		if(err){
			throw err;
		}else{
			console.log("Your connection is successful once again for user registration");
			var sql = "INSERT INTO users(uname,upassword) values('" +userName+ "','" +userpass+ "');"
			console.log(sql);
			con.query(sql,function(err,result,fields){
				if(err){
					throw err;
				}else{
					console.log(result);
					console.log(fields);
					res.send('<html>'
						    + '<h3> Hi ' + userName + " " +"Your Registration is successful !" + '</h3>'
						    + '</html>');
				}
			});
		}
	});

	//res.send("We are registering you, Your entries are as: " + userName + " " + userpass);
});

/***********************End User Registration************************/

/***********************Start reset password section************************/
app.post('/resetPassword',function(req,res){
	res.setHeader('content-Type','text/html');

	userName = req.body.username;
	password = req.body.password;
	rePassword = req.body.repassword;
	console.log("Your user Name is :" + userName + " " + "Your pass is: " + password + " " + "Your Re-Enter password is :" + rePassword);
	var con =  mysqlDbConnection.dbConnection();
	con.connect(function(err){
		if(err){
			throw err;
		}else{
			console.log("Your connection with my SQL is successful, Now you can fire your queries from here!");
			var sql = "SELECT * from users where uname = '" +userName+ "' ;"
			console.log(sql);
			con.query(sql,function(err,result,fields){
				if(err){
					throw err;
				}else{
					console.log(result);
					if(result.length >=1){
						var sql = "UPDATE users set upassword ='" +password+ "' where uname ='" +userName+ "' ;"
						console.log("Sql for update user Password: " + sql);
						con.query(sql,function(err,result,fields){
							if(err){
								throw err;
							}else{
								console.log(result);
								console.log(fields);
								console.log("Your password has been updated successfully.!");
								var sql = "Select * from users where uname = '" + userName + "';"
								console.log(sql);
								con.query(sql,function(err,result,fields){
									if(err){
										throw err;
									}else{
										console.log(result);
										console.log(fields);
										res.write("Hey your password has been updated successfully." + " " + "For the user name : " + userName + " " + "Your password is :" + result[0].upassword);
									}
								});
								
							}
						});
					}else{
						console.log("User name does not exists");
						res.redirect('/login_failed');
					}
				}
			});
		}
	});
	
});
/***********************End reset password section**************************/


var server = app.listen(8080,function(req,res){
	console.log("Server is listening at http://localhost:8080/");
});