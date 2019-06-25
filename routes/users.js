const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const User = require('../model/user.model');
const config = require('../config/database');

router.post('/register', (req, res)=>{
    let newUser = new User({
        username : req.body.username,
        password : req.body.password,
        email    : req.body.email,
    });
    User.addUser(newUser,(err,user)=>{
        if(err){
            let message = "";
            if(err.errors.username) message = "Username is already taken .";
            if(err.errors.username) message += " Email is already taken";
            return res.json({
                success:false,
                message
            });
        }else{
            return res.json({
                success:true,
                message:"User registration is successful"
            });
        }
    });
});

router.post('/login',(req,res)=>{
         const username = req.body.username;
         const password = req.body.password;
         User.getUserByUsername(username,(err,user)=>{
             if(err)throw err;
             if(!user){
                 return res.json({
                     success:false,
                     message:"User not found"
                 });
             }
             User.comparePassword(password,user.password,(err, isMatch)=>{
                 if(err)throw err;
                 if(isMatch){
                     const token = jwt.sign({
                         type:"user",
                         data:{
                             _id:user._id,
                             username:user.username,
                             password:user.password,
                             email:user.email,
                             dob:user.dob
                         }
                    
                     }, config.secret,{
                         expiresIn:604800 // for 1 week time in milliseconds  
                     }
                     
                     );
                     return res.json({
                         success:true,
                         token: "JWT " + token
                     });
                 }else{
                     return res.json({
                         success:false,
                         message:"Wrong password"
                     });
                 }
             });
         });
});

router.get('/',passport.authenticate('jwt',{ session:false }),(req,res)=>{
    if(req.role == "admin"){
    User.getAllUsers((err,users)=>{
        if(err)throw err;
        if(users){
            return res.json(users)
        }
    })
}
else{
    return res.json({
        success: false,
        message: "Unauthorized access"
    });
}
});

router.delete('/:id',passport.authenticate('jwt',{ session:false }),(req,res)=>{
    User.deleteUserById(req.params.id,(err,user)=>{
        if(err) throw err;
        return res.json({
           id:user._id,
            message:"User deleted"
        });
    });
});

router.put('/:id',(req,res)=>{
    User.updateUserById(req.params.id,req.body,(err,updatedUser)=>{
        if(err)throw err;
        User.updateOne({_id: req.params.id}, updatedUser).then( e => {
               res.json({
                message:"User Updated"
            })
        });
    })
})

// Authenticated user profile

router.get('/profile',passport.authenticate('jwt',{ session:false }),(req,res)=>{
    return res.json(
        req.user
    )
})

module.exports = router