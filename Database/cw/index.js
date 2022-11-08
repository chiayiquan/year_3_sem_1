const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2");
const path = require("path");
const connectionConfig = require("./dbconfig");
const mustacheExpress = require("mustache-express");

const app = express();
const port = 8088;

const db = mysql.createConnection(connectionConfig);

db.connect((err) => {
  if (err) throw err;
  console.log("Connected to database");
});
global.db = db;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname))); // to make script src to refer to file that are in views
app.use(bodyParser.json());

require("./routes")(app);
app.set("view engine", "html");
app.set("views", __dirname + "/templates");
app.engine("html", mustacheExpress());

app.listen(port, () => console.log(`Node is running on port ${port}!`));

// http
//   .createServer(function(req, res) {
//     res.writeHead(200, { "Content-Type": "text/plain" });
//     res.write("Welcome to the mid-term application! \n\n");
//     res.write("This application must run on PORT 8089");
//     res.end();
//   })
//   .listen(8089, function() {
//     console.log("Node server is running...");
//   });
