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
module.exports.createUser = function(nuevoUsuario, callback) {
    bcrypt.genSalt(10, function(err, salt) {
        bcrypt.hash(nuevoUsuario.password, salt, function(err, hash) {
            nuevoUsuario.password = hash;
            nuevoUsuario.save(callback);
        });
    });
}
module.exports.obtenerUsuarioPorEmail = function(email, callback) {
    var query = {
        email: email
    };
    User.findOne(query, callback);
    //User.find(query, callback); // No funciona D:
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