var express = require('express');
var router = express.Router();
var session=require('express-session')
var bodyParser=require('body-Parser');
var User=require('../models/user')
router.use(bodyParser.json());
var passport=require('passport');
var authenticate=require('../authenticate')

/* GET users listing. */
router.get('/',authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next)=> {
  User.find({})
  .then((data)=>{
    res.statusCode=200;
    res.setHeader('Content-Type','application/json')
    res.json(data);
  },(err)=>next(err))
  .catch((err)=>next(err))
});

router.post('/signup',(req,res,next)=>{
  User.register(new User({username:req.body.username}),
  req.body.password,(err,user)=>{
    if(err){
      req.statusCode=500;
      res.setHeader('Content-Type','application/json');
      res.json({err:err});
    }
    else{
      // if(req.body.admin){
      //   user.admin=req.body.admin
      // }
      if(req.body.firstname){
        user.firstname=req.body.firstname
      }
      if(req.body.lastname){
        user.lastname=req.body.lastname
      }
      user.save((err,user)=>{
        if(err){
          req.statusCode=500;
        res.setHeader('Content-Type','application/json');
        res.json({err:err});
        }
        passport.authenticate('local')(req,res,()=>{
          res.statusCode=200;
          res.setHeader('Content-Type','application/json');
          res.json({success:true,status:"Registration Successfully"})
        })
      })
      
    }
  })})
router.post('/login',passport.authenticate('local'),(req, res)=>{
    var token=authenticate.getToken({_id:req.user._id})
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true,token:token, status: 'You are successfully logged in!'});
});
router.get('/logout', (req, res) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    
  }
});
router.post('/token',authenticate.verifyUser,async(req,res,next)=>{
  try {
      const use=req.user._id
      console.log(use)
      const user=await User.findById(use).select("-password");
      res.json(user)
      
  } catch (error) {
      console.log(error.message)
      res.status(500).send("Server Error Kindly Check")
  }
          })

module.exports = router;
