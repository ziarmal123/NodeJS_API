const express =require('express')
const bodyParser=require('body-parser')
const mongoose=require('mongoose');
const Promotion=require("../models/promotion")
const PromoRouter=express.Router();
const authenticate=require('../authenticate')

PromoRouter.use(bodyParser.json());

PromoRouter.route('/')
.get((req,res,next)=>{
    Promotion.find({})
    .then((promo)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json')
        res.json(promo);
        },(err)=>next(err))
    .catch((err)=>next(err))   
    })
.post(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Promotion.create(req.body)
    .then((promo)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json')
        res.json([promo])

    },(err)=>next(err))
    .catch((err)=>next(err))
})
.put(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    res.end('This Function is not Working Here'+ req.method);
})
.delete(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Promotion.remove({})
    .then((data)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json')
        res.json(data)
    },(err)=>next(err))
    .catch((err)=>next(err))
});
PromoRouter.route('/:promoid')
.get((req,res,next)=>{
    Promotion.findById(req.params.promoid)
    .then((promo)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(promo)
    },(err)=>next(err))
    .catch((err)=>next(err))
})
.post(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    res.end('This method '+req.method +' is not working,in Id: '+req.params.promoid)
})
.put(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Promotion.findByIdAndUpdate(req.params.promoid,{$set:req.body},{new:true})
    .then((promo)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json')
        res.json(promo)
    },(err)=>next(err))
    .catch((err)=>next(err))
})
.delete(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Promotion.findByIdAndRemove(req.params.promoid)
    .then((promo)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json')
        res.json(promo)
    },(err)=>next(err))
    .catch((err)=>next(err))
});

module.exports=PromoRouter;