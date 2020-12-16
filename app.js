const express = require('express');
const handlebars = require('express-handlebars').create({ defaultLayout: 'main' });
const bodyParser = require('body-parser');
const mysql = require("./public/js/dbcon.js");
const db_queries = require("./public/js/db_queries.js");

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// ? Use handlebars rendering here
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// ? For using mysql
app.set('mysql', mysql);
app.set('db_queries', db_queries)

// ? can choose a port here
app.set('port', process.argv[2]);

//I don't know what this is for?
app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
  // ? basic route returns text
  // res.send('Johnny come home again?');

  // ? return handlebars page
  // let context = {}
  // res.render('home', context);
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');


  mysql.pool.query(db_queries.SELECT, (error, results, fields) => {
    if (error) {
      console.log(error);
    }

    // Change boolean indicating units to actual units
    results.forEach((element) => {
      if (element.lbs == 1 || element.lbs == null) {
        element.lbs = 'lbs';
      }
      else {
        element.lbs = 'kgs';
      }
    })

    // var output = JSON.stringify(results);
    // res.end(output);
    let context = {};
    context.results = results;
    res.render('home', context);
  })
});


app.get('/reset-table', function (req, res, next) {
  var context = {};
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/html');
  mysql.pool.query(db_queries.DROP, function (err) { //replace your connection pool with the your variable containing the connection pool
    mysql.pool.query(db_queries.CREATE, function (err) {
      context.results = "Table reset";
      res.render('home');
      // res.redirect('/');
    })
  });
  console.log('Table Reset');
});

app.listen(app.get('port'), () => {
  console.log(`Server started on port: ${app.get('port')}`);
  console.log(`Press control-c to terminate.`)
});
