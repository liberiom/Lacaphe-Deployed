const express = require('express');
var mysql = require('mysql2');
var con = mysql.createConnection({
  host: "localhost",
  user: "liberio", // On the real server, we should make a separate user account with sufficient privileges as opposed to using the root account
  password: "DemBoys"
});
con.connect(function(err) {
  if (err) throw err;
  console.log("Connected to local mysql server!");

  con.query("CREATE DATABASE IF NOT EXISTS lacaphedb")
    if (err) throw err;
    console.log("Database created");
  con.query("use lacaphedb")
    if (err) throw err;
  
  var dropsql = "DROP TABLE IF EXISTS testtable"
  con.query(dropsql, function (err){
    if (err) throw err;
    console.log("Test table dropped if it exits");
  })

  // 's' = signature drinks, 'c' = coffee, 't' = tea, 'i' = ice blended
  var tablesql = "CREATE TABLE testtable(id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255), image VARCHAR(255), price DECIMAL(5,2), type VARCHAR(2))"
  con.query(tablesql, function (err){
    if (err) throw err;
    console.log("Test table created");
  })

  var insertsql = "INSERT INTO testtable (name, image,price,type) VALUES('boba tea','https://www.unionsquareawards.org/wp-content/uploads/2019/09/images3904-5d882e0c1594c.jpg',2.50,'t'),"
                    +"('lychee Tea','https://s3-media0.fl.yelpcdn.com/bphoto/Z0nZF9zYTaMVT5nbbGuxDA/o.jpg',3.75, 't'),"
                    +"('Test Coffee','https://images.immediate.co.uk/production/volatile/sites/30/2020/08/flat-white-3402c4f.jpg?quality=90&webp=true&resize=500,454',5.00, 'c'),"
                    +"('Signature Meme Drink', 'http://1.bp.blogspot.com/-JFw1MGN5OoM/UD-BpCdlxzI/AAAAAAAAEMQ/brNZEjdhZWU/s1600/Lychee%2BMartini%2B3fc.jpg', 5.00, 's'),"
                    +"('Ice Blended Drink', 'https://www.gfbfood.com.my/wp-content/uploads/2020/03/Untitled-design-1.jpg', 2.75, 'i');"
  con.query(insertsql, function (err){
    if (err) throw err;
    console.log("Test table filled");
  })
  var getsql = "SELECT * from testtable"
  con.query(getsql, function(err, result){
    if(err) console.log(err);
    else {
      const data = JSON.stringify(result)
      console.log(data)
    }
  })
});
const app = express();
const port = 3000; 

app.use(express.static("./")); // I can't run the website properly without this line
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
app.get('/about', (req, res) => {
  res.sendFile(__dirname + '/about.html');
});
app.get('/order', (req, res) => {
  res.sendFile(__dirname + '/order.html');
});
app.get('/drinks', (req, res) => {
  res.sendFile(__dirname + '/drinks.html');
});
app.get('/drinks/list', (req, res) => {
  let type = req.query.type;
  // console.log(type);
  con.query('SELECT * FROM testtable WHERE type = ?', [type], (err, result) => {
    if (err) {
      res.status(500).send('Database Error :(');
      console.error(err);
      return;
    }
    res.json(result);
  });
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});








