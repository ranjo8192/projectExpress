var mysql = require('mysql');
var express = require('express');
var mysqlDbConnection = require('./mysqlDbConnection');
var app = express();

//bodyParser =require('body-parser'),

//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: true })); 




app.use(express.static('public'));

app.get('/' ,function(req,res){
	res.sendFile(__dirname + "/" + "login.html")
});
app.get('/success',function(req,res){
	res.sendFile(__dirname + "/" + "success.html")
});

app.get('/dashboard',function(req,res){
	res.sendFile(__dirname + "/" + "dashboard.html" )
});

app.get('/loginfailed',function(req,res){
	res.sendFile(__dirname + "/" + "login_failed.html" )
});

/*********************Start User Login***********************/

app.get('/login',function(req,res){
			// Prepare out put in JSON format

			//response = {
				userName = req.query.userName;
				password = req.query.password;

				console.log("Username is:" + userName + " "+ "User password is :" + password);
			//}
			//console.log(response);
			//res.redirect("/success");
		var con = mysqlDbConnection.dbConnection();
		con.connect(function(err){
			if(err){
				throw err;
			}
			console.log("Connection with mysql is successful.");
			var sql = "SELECT * FROM users where uname ='"+userName+"' &&  upassword ='"+password+"' ";
			con.query(sql,function(err,result,fields){
				//console.log(result);
				if(err){
					throw err;
				}
				console.log("Query Executed successfully.!");
				console.log(result);
				if(result.length >= 1){
				console.log("Hey your login is successfull.!");
				console.log("You are redirected to the dashboard");
				res.redirect("/addproduct");
				
				}else{
					console.log("You user name password not matched");
					res.redirect('loginfailed');

					}
				});

		});
});

/*****************************End user Login*******************/

app.get('/addproduct',function(req,res){
	res.sendFile(__dirname + "/" + "addProduct.html" )

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
	res.setHeader('Content-Type','text/plain');
	userName = req.query.userName;
	
	var con = mysqlDbConnection.dbConnection();
	con.connect(function(err){
		if(err){
			throw err;
		}else
		console.log('You have connected with mysql database for password retreive');
		var sql = "select * from users where uname ='"+userName+"'";
		
		con.query(sql,function(err,result,fields){
			if(err){
				throw err;
			}

			console.log(result);
			
			//console.log(result.length);
			if(result.length >= 1){

				console.log("Your Username has matched");
				
				//res.redirect('/getusername');
				//res.writeHead(200,{'content-Type':'text/html'});
				res.send("Your User Name is: " + " " + " " + "Your Password is: " );
				//res.end();
			}
			else{
				console.log("User Name does exists. Please create account.");
				res.redirect('/cretaeaccount');
				
				}
			
		});
	});
});

app.get('/getusername',function(req,res){
	res.sendFile(__dirname + "/" + "userGetRequest.html");
});

var server = app.listen(8080,function(req,res){
	console.log("Server is listening at http://localhost:8080/");
});