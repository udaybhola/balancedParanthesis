const mongoose =require('mongoose');
const bcrypt = require('bcryptjs');
const uniqueValidator = require('mongoose-unique-validator')
const Schema = mongoose.Schema

const BalancedUserSchema = new Schema({
    username:{type:String,unique:true,required:true},
    message:{type:String},
    attempts:{type:Number,default:0}
});


const BalancedUser = mongoose.model('BalancedUser',BalancedUserSchema);
module.exports = BalancedUser;