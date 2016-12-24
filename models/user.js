var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
// User Schema
var UserSchema = mongoose.Schema({
    email: {
        type: String,
        index: true,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String
    }
});
var User = module.exports = mongoose.model('User', UserSchema);
module.exports.crearUsuario = function(nuevoUsuario, callback) {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(nuevoUsuario.password, salt, function(err, hash) {
            nuevoUsuario.password = hash;
            nuevoUsuario.save(callback);
        });
    });
}
module.exports.actualizarUsuario = function(usuarioActual, callback) {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(usuarioActual.password, salt, function(err, hash) {
            usuarioActual.password = hash;
            var query = {
                email: usuarioActual.emailactual
            };
            User.findOneAndUpdate(query, {
                "$set": {
                    "name": usuarioActual.name,
                    "email": usuarioActual.emailnuevo,
                    "password": usuarioActual.password
                }
            }, callback);
        });
    });
}
module.exports.eliminarUsuario = function(email, callback) {
    var query = {
        email: email
    };
    User.findOneAndRemove(query, callback);
}
module.exports.obtenerUsuarioPorEmail = function(email, callback) {
    var query = {
        email: email
    };
    User.findOne(query, callback);
}
module.exports.obtenerUsuarioPorId = function(id, callback) {
    User.findById(id, callback);
}
module.exports.compararPassword = function(passwordAuxiliar, hash, callback) {
    bcrypt.compare(passwordAuxiliar, hash, function(err, isMatch) {
        if (err) throw err;
        callback(null, isMatch);
    });
}