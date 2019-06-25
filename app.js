var express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const passport = require('passport')

global.atob = require("atob");

const config = require('./config/database')
// Connect the database
mongoose.set('useCreateIndex', true);

mongoose.Promise = Promise;

mongoose.connect(config.connectionString,{useNewUrlParser:true})
.then(()=>{
    console.log("Database Connected Successfully");
}).catch(err=> console.log(err));

mongoose.set('useFindAndModify', false);
var app = express();

const port = process.env.PORT || '8080';


app.use(bodyParser.json());
app.use(cors());
app.use(passport.initialize())
app.use(passport.session());

app.get('/', (req,res)=>{
    res.send({message:"BiggAppCompany Assignment"})
})

//Custom middleware
const checkUserType = function(req,res,next){
    const userType = req.originalUrl.split('/')[2];
    require('./config/passport')(req,userType,passport);
    next();
}
app.use(checkUserType);

const users = require('./routes/users');
app.use('/api/users',users);

const admin = require('./routes/admin');
app.use('/api/admin',admin);

 const balancedUser = require('./routes/balancedUser');
  app.use('/api/admin/balanced',balancedUser);
  app.use('/api/users/balanced',balancedUser);

app.listen(port,()=>{
    console.log("Server is running on port", port);
})