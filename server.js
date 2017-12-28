var mysql = require('mysql');
var express = require('express');
var mysqlDbConnection = require('./mysqlDbConnection');
var app = express();

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

/*********************Start User Login***********************/

app.get('/login',function(req,res){
			// Prepare out put in JSON format

			//response = {
				userName = req.query.userName,
				password = req.query.password
			//}
			//console.log(response);
			//res.redirect("/success");
		var con = mysqlDbConnection.dbConnection();
		con.connect(function(err){
			if(err){
				throw err;
			}else{
				console.log("Connection with mysql is successful.");
				var sql = "SELECT * FROM users";
				con.query(sql,function(err,result,fields){
					if(err){
						throw err;
					}else{
						//console.log(result);
						//console.log(fields);
						if(result.length == 0){
							console.log("No Record Found");
						}else{
							for(i=0;i<result.length;i++){
								dbUserName = result[i].uname;
								dbPassword = result[i].upassword;
								//console.log(dbUserName);
								//console.log(dbPassword);
							}

							if((userName == dbUserName) && (password == dbPassword)){
								console.log("Hey your login is successfull.!");
								console.log("You are redirected to the dashboard");
								res.redirect("/addproduct");

							}else{
								console.log("Login Failed..!");
								res.redirect("/");
							}
							//db.close();
						}
					}
				});
			}
		});
});

/*****************************End user Login*******************/

/*****************************Start Add Product****************/

app.get('/addProduct',function(req,res){
	res.sendFile(__dirname + "/" + "addProduct.html" )

});


app.get('/addproductRequest',function(req,res){

	productCategory = req.query.productCategory,
	pruductManufacturer = req.query.pruductManufacturer,
	productDescription = req.query.productDescription,
	productCost = req.query.productCost,
	productQuantity = req.query.productQuantity,
	productSpecification = req.query.productSpecification;

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
			var sql = "insert into products (productCategory,productManufacturer,productDescription,productCost,productQuantity,productOtherSpecifiaction) values('"+productCategory+"','"+pruductManufacturer+"','"+productDescription+"','"+productCost+"','"+productQuantity+"','"+productSpecification+"')";
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

/**************************End Add Product******************/

/*******************Starts Get Products form Database*******/ 
app.get('/retreiveProduct',function(req,res){
	res.sendFile(__dirname + "/" + "retreiveproduct.html")
})
/*******************Starts Get Products form Database*******/ 


var server = app.listen(8080,function(req,res){
	console.log("Server is listening at http://localhost:8080/");
});