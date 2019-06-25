const express = require('express');
const router = express.Router();
const passport = require('passport');
const BalancedUser = require('../model/balancedUser.model');
const isBalancedParenthesis = require('../service/checkParanthesis')

router.post('/', passport.authenticate('jwt', { session: false }), (req, res) => {

    let paranthesis = req.body
  
    let paranthesisObj = isBalancedParenthesis(paranthesis.input)
    
    if (paranthesisObj.length) {
        BalancedUser.findOneAndUpdate({username: req.user.username},{message: 'fail', $inc: {attempts: 1}}, {new: true} ,(err,user) => {
            
            if(err) throw err;
            if(!user) { 
                // create user
                user = new BalancedUser({
                    username: req.user.username,
                    message: 'fail',
                    attempts: 1
                })
                user.save()
            }

            res.json({username: user.username, message:"", attempts: `${user.attempts} ${paranthesisObj.join('')} are unbalanced.`})
        })
    } else {
        BalancedUser.findOneAndUpdate({username: req.user.username},{message: 'success', $inc: {attempts: 1}}, {new: true} ,(err,user) => {
            
            if(err) throw err;
            if(!user) { 
                // create user
                user = new BalancedUser({
                    username: req.user.username,
                    message: 'success',
                    attempts: 1
                })
                user.save()
            }

            res.json({username: user.username, message: 'success',attempts:user.attempts})
        })
    }
})

module.exports = router