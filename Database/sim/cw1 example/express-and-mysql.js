const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const mustacheExpress = require('mustache-express');

const app = express();
const port = 3000;

app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', './templates');
app.use(bodyParser.urlencoded({ extended: true }));

var dbcon = mysql.createConnection({
    host: 'localhost',
    user: 'francis',
    password: 'california',
    database: 'clf_crime_data'
})

function templateRenderer(template, res) {
    return function (error, results, fields) {
        if (error)
            throw error;
        
        res.render(template, { data: results });
    }
}

app.get('/', function (req, res) {
    dbcon.connect();
    dbcon.query("SELECT * FROM districts;", templateRenderer('index', res));
    dbcon.end();
})

app.listen(port, function () {
    console.log('The app is listening at http://localhost:' + port + '.'); 
})
