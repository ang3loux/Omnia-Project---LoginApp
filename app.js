var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
// Inicializar DB
var mongo = require('mongodb');
var mongoose = require('mongoose');
// Conexion con la DB
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/pruebadb');
var db = mongoose.connection;
// Definir rutas
var routes = require('./routes/index');
var users = require('./routes/users');
// Inicializar App
var app = express();
// Definir motor de vistas
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({
    defaultLayout: 'layout'
}));
app.set('view engine', 'handlebars');
// Inicializar pluggin body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
// Definir cookies
app.use(session({
    cookie: {
        maxAge: 60000
    },
    secret: 'estosesuponequeesunmsjsecreto',
    resave: false,
    saveUninitialized: false
}));
// Definir directorio publico
app.use(express.static(path.join(__dirname, 'public')));
// Inicializar pluggin passport
app.use(passport.initialize());
app.use(passport.session());
// Inicializar pluggin express-validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.'),
            root = namespace.shift(),
            formParam = root;
        while (namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param: formParam,
            msg: msg,
            value: value
        };
    }
}));
// Inicializar pluggin connect-flash
app.use(flash());
// Establecer variables globales
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    // Mensaje de error del passport
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});
// 
app.use('/', routes);
app.use('/users', users);
// Definir puerto
app.set('port', (process.env.PORT || 3000));
app.listen(app.get('port'), function() {
    console.log('Servidor iniciado en el puerto ' + app.get('port'));
});