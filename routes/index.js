var express = require('express');
var router = express.Router();
// Ruta de inicio
router.get('/', comprobarAcceso, function(req, res) {
    res.render('index');
});
// Token de validacion de usuario con acceso
function comprobarAcceso(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/users/login');
    }
}
module.exports = router;