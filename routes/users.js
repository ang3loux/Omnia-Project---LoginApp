var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../models/user');
// ----------------------------------------------------------------------------------------- Inicio rutas GET
// Ruta de registro
router.get('/register', function(req, res) {
    res.render('register');
});
// Ruta de acceso
router.get('/login', function(req, res) {
    res.render('login');
});
// Ruta de logout
router.get('/logout', comprobarAcceso, function(req, res) {
    req.logout();
    req.flash('success_msg', 'Sesión terminada.');
    res.redirect('/users/login');
});
// Ruta de actulizar perfil
router.get('/update', comprobarAcceso, function(req, res) {
    res.render('update');
});
// Token de validacion de usuario loggeado
function comprobarAcceso(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/users/login');
    }
}
// ----------------------------------------------------------------------------------------- Inicio rutas POST
// Registrar usuario
router.post('/register', function(req, res) {
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    var password2 = req.body.password2;
    // Validacion de campos
    req.checkBody('name', 'Campo "Nombre" no puede quedar vacio.').notEmpty();
    req.checkBody('email', 'Campo "Email" no puede quedar vacio.').notEmpty();
    req.checkBody('email', 'Formato de "Email" no valido.').isEmail();
    req.checkBody('password', 'Campo "Contraseña" no puede quedar vacio.').notEmpty();
    req.checkBody('password2', 'Contraseñas no coinciden.').equals(req.body.password);
    var errors = req.validationErrors();
    if (errors) {
        res.render('register', {
            errors: errors
        });
    } else {
        User.obtenerUsuarioPorEmail(email, function(err, user) {
            if (err) throw err;
            if (!user) {
                var nuevoUsuario = new User({
                    name: name,
                    email: email,
                    password: password
                });
                User.createUser(nuevoUsuario, function(err, user) {
                    if (err) throw err;
                    else {
                        req.flash('success_msg', 'Registro exitoso.');
                        res.redirect('/users/login');
                    }
                    console.log(user);
                });
            } else {
                req.flash('error_msg', 'Usuario ya registrado.');
                res.redirect('/users/register');
            }
        });
    }
});
// Estrategia de acceso
passport.use(new LocalStrategy(function(email, password, done) {
    User.obtenerUsuarioPorEmail(email, function(err, user) {
        if (err) throw err;
        if (!user) {
            return done(null, false, {
                message: 'Usuario no registrado.'
            });
        }
        User.compararPassword(password, user.password, function(err, isMatch) {
            if (err) throw err;
            if (isMatch) {
                return done(null, user);
            } else {
                return done(null, false, {
                    message: 'Contraseña invalida.'
                });
            }
        });
    });
}));
passport.serializeUser(function(user, done) {
    done(null, user.id);
});
passport.deserializeUser(function(id, done) {
    User.obtenerUsuarioPorId(id, function(err, user) {
        done(err, user);
    });
});
// Acceder usuario
router.post('/login', passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/users/login',
    failureFlash: true
}), function(req, res) {
    res.redirect('/');
});
module.exports = router;