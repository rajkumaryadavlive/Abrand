const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();
var indexroutes = require("./routes");
const app = express();
const session = require('express-session');
var expressLayouts = require('express-ejs-layouts');

const hbs = require('hbs');
var http = require('http');
var https = require('https');
const cookieParser = require('cookie-parser');
var fs = require('fs-extra');
const routes = require('./routes/index.js');
const probit = require('./routes/probit.js');

const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/AbuBakr",
{ useUnifiedTopology: true } ,
{ useNewUrlParser: true });
//new api
const flash = require('express-flash');


app.use(session({
    secret: 'userdetails',
    resave: false,
    saveUninitialized: true
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine','ejs');

// Set public folder
app.use(express.static(path.join(__dirname,'/public')));
//app.use(express.static(path.join(__dirname, 'logo')));

app.use(flash())

app.use("/", indexroutes);
console.log(process.env.ADMIN)

app.use(cookieParser('keyboard cat'));
app.use(session({ 
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}));

app.set('layout', 'admin/layouts/layout');

// hbs.registerPartials(__dirname + '/views/admin/admin-login/partials');

app.get('*', function(req,res,next) {
   res.locals.cart  = req.session.cart;
   res.locals.user  = req.user || null;
   next();
});

app.use('/', routes);

 app.engine('ejs', require('ejs').renderFile);
 app.set('view engine', 'ejs');

 app.get('/', (req, res) => {
    res.send('Hello World!')
    res.setHeader('X-Foo', 'bar')
   })

/*var options = {

key: fs.readFileSync('/etc/letsencrypt/live/ebtico.com/privkey.pem', 'utf8'),

cert: fs.readFileSync('/etc/letsencrypt/live/ebtico.com/cert.pem', 'utf8'),

ca: fs.readFileSync('/etc/letsencrypt/live/ebtico.com/chain.pem', 'utf8')
    
};*/

console.log('3009')
// Create an HTTP service.
http.createServer(app).listen(4000); 
// Create an HTTPS service identical to the HTTP service.
https.createServer(app).listen(443);


 // Set 'views' directory for any views 
 // being rendered res.render()
//const PORT = 443;
//app.listen(PORT, () => console.log(`App listening on port ${PORT}!`));