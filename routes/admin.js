const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const Admin = require('../model/admin.model');
const config = require('../config/database');
global.atob = require("atob");


router.post('/register', (req, res)=>{
    let newAdmin = new Admin({
        username : req.body.username,
        password : req.body.password,
        email    : req.body.email,
    });
    Admin.addAdmin(newAdmin,(err,admin)=>{
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
                message:"Admin registration is successful"
            });
        }
    });
});

router.post('/login',(req,res)=>{
         const username = req.body.username;
         const password = req.body.password;
         Admin.getAdminByUsername(username,(err,admin)=>{
             if(err)throw err;
             if(!admin){
                 return res.json({
                     success:false,
                     message:"Admin not found"
                 });
             }
             Admin.comparePassword(password,admin.password,(err, isMatch)=>{
                 if(err)throw err;
                 if(isMatch){
                     const token = jwt.sign({
                         type:"admin",
                         data:{
                             _id:admin._id,
                             username:admin.username,
                             password:admin.password,
                             email:admin.email,
                             dob:admin.dob
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

router.get('/',(req,res)=>{
     Admin.getAllAdmin((err,admin)=>{
         if(err)throw err;
         if(admin){
             return res.json(admin)
         }
     })
    
})

router.delete('/:id',(req,res)=>{
    Admin.deleteAdminById(req.params.id,(err,admin)=>{
        console.log("req.params.id",req.params.id)
        if(err) throw err;
        return res.json({
            id:admin._id,
            message:"Admin deleted"
        });
    });
});

router.put('/:id',(req,res)=>{
  
    Admin.updateAdminById(req.params.id,req.body,(err,updatedAdmin)=>{
        if(err)throw err;
        Admin.updateOne({_id: req.params.id}, updatedAdmin).then( e => {
            res.json({
                message:"Admin Updated"
            })
        });
    })
})



router.get('/profile',passport.authenticate('jwt',{ session:false }),(req,res)=>{
    return res.json(
        req.user
    )
})

module.exports = router