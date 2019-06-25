const mongoose =require('mongoose');
const bcrypt = require('bcryptjs');
const uniqueValidator = require('mongoose-unique-validator')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    username:{type:String,unique:true,required:true},
    password:{type:String,required:true},
    email:{type:String,unique:true,index:true,required:true},
    dob: { type: Date, default: new Date() },
});

UserSchema.plugin(uniqueValidator);
const User = mongoose.model('User',UserSchema);
module.exports = User;

module.exports.getUserById = function(id, callback){
    User.findById(id, callback);
}

module.exports.getUserByUsername = function(username, callback){
    const query = {
        username: username
    }
    User.findOne(query,callback);
}

module.exports.getAllUsers = function(callback){
    User.find(callback)
}

module.exports.deleteUserById =  function(id, callback){
    User.findByIdAndDelete(id,callback);
}

module.exports.addUser = function(newUser, callback){
    bcrypt.genSalt(10,(err,salt)=>{
        bcrypt.hash(newUser.password,salt,(err,hash)=>{
            if(err)throw err;
            newUser.password = hash;
            newUser.save(callback);
        });
    });
}

module.exports.updateUserById = function (id, userParam, callback) {
    user = User.findById(id);

    if (!user) callback(err);

    if (userParam.password) {
        bcrypt.genSalt(10, (err, salt) => {
            bcrypt.hash(userParam.password, salt, (err, hash) => {
               if (err) throw err;
                userParam.password = hash;
                callback(null, userParam);
            })
        })
    }

}

module.exports.comparePassword = function(password, hash, callback){
    bcrypt.compare(password, hash,(err,isMatch)=>{
        if(err) throw err;
        callback(null,isMatch);
    });
}
  
