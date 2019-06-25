const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const uniqueValidator = require('mongoose-unique-validator')
const Schema = mongoose.Schema

const AdminSchema = new Schema({
    username: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    email: { type: String, unique: true, index: true, required: true },
    dob: { type: Date, default: new Date() },
});

AdminSchema.plugin(uniqueValidator);
const Admin = mongoose.model('Admin', AdminSchema);
module.exports = Admin;

module.exports.getAdminById = function (id, callback) {
    Admin.findById(id, callback);
}

module.exports.getAllAdmin = function (callback) {
    Admin.find(callback)
}

module.exports.getAdminByUsername = function (username, callback) {
    const query = {
        username: username
    }
    Admin.findOne(query, callback);
}

module.exports.deleteAdminById = function (id, callback) {
    Admin.findByIdAndDelete(id, callback);
}

module.exports.updateAdminById = function (id, adminParam, callback) {
    admin = Admin.findById(id);

    if (!admin) callback(err);

    if (adminParam.password) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(adminParam.password, salt, (err, hash) => {
               if (err) throw err;
                adminParam.password = hash;
                callback(null, adminParam);
            })
        })
    }

}

module.exports.addAdmin = function (newAdmin, callback) {
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newAdmin.password, salt, (err, hash) => {
            if (err) throw err;
            newAdmin.password = hash;
            newAdmin.save(callback);
        });
    });
}

module.exports.comparePassword = function (password, hash, callback) {
    bcrypt.compare(password, hash, (err, isMatch) => {
        if (err) throw err;
        callback(null, isMatch);
    });
}

