const express =require('express');
const mongoose=require('mongoose')
const bodyParser= require('body-parser');
const leaderRouter=express.Router();
const Leader=require('../models/leaders')
leaderRouter.use(bodyParser.json())
const authenticate=require('../authenticate')

leaderRouter.route('/')
.get((req,res,next)=>{
    Leader.find({})
    .then((leader)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json')
        res.json(leader);
    },(err)=>next(err))
    .catch((err)=>next(err))   
})
.post(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
   Leader.create(req.body)
   .then((leader)=>{
    console.log("Leader ID",leader);
    res.statusCode=200;
    res.setHeader('Content-Type','application/json')
    res.json(leader);
   },(err)=>next(err))
   .catch((err)=>next(err))
})

.put(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    res.end('This Operation is not Supported Here! '+req.method)
})
.delete(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Leader.remove({})
    .then((resp)=>{ 
        res.statusCode=200;
        res.setHeader('Content-Type','application/json')
        res.json(resp);
    },(err)=>next(err))
    .catch((err)=>next(err))   
});


leaderRouter.route('/:leaderId')

.get((req,res,next) => {
    Leader.findById(req.params.leaderId)
    .then((leader)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json')
        res.json(leader);
    },(err)=>next(err))
    .catch((err)=>next(err))  
})

.post(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /Leader/'+ req.params.leaderId);
})

.put(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Leader.findByIdAndUpdate(req.params.leaderId,{$set:req.body},{new:true})
    .then((data)=>{
        res.statusCode=200;
        res.setHeader('Content-Type','application/json')
        res.json(data);
    },(err)=>next(err))
    .catch((err)=>next(err))  
})
// .put((req,res,next)=>{
//     Leader.findById(req.params.leaderId)
//     .then((data)=>{
//         if(data!= null && req.params.leaderId!= null){
//             if(req.body.name){
//                 data.name=req.body.name
//             }
//             data.save()
//             .then((data)=>{
//                 res.statusCode=200;
//                        res.setHeader('Content-Type','application/json')
//                        res.json(data);
//             },(err)=>next(err))
//         }
//         else if(data == null){
//             err=new Error('Leader'+ req.params.leaderId+' Not Found');
//             res.statusCode=404;
//             return next(err)
//         }
//         else{
//             err = new Error('Comment ' + req.params.leaderId + ' not found');
//             err.status = 404;
//             return next(err);

//         }
        
//     })
//     .catch((err)=>next(err))

// })

.delete(authenticate.verifyUser,authenticate.verifyAdmin,(req, res, next) => {
    Leader.findByIdAndRemove(req.params.leaderId)
    .then((resp)=>{ 
        res.statusCode=200;
        res.setHeader('Content-Type','application/json')
        res.json(resp);
    },(err)=>next(err))
    .catch((err)=>next(err))
})
leaderRouter.route('/:leaderId/performance')
.get((req,res,next)=>{
    Leader.findById(req.params.leaderId)
    .then((performance)=>{
        console.log(performance)
        if(performance!=null){
            res.statusCode=200
            res.setHeader('Content-Type','application/json')
            res.json(performance.performance)
        }
        else{
                err=new Error('Leader'+ req.params.leaderId+' Not Found');
                res.statusCode=404;
                return next(err)
        }
       
    },(err)=>next(err))

})
.post(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Leader.findById(req.params.leaderId)
    .then((perform)=>{
        if(perform!=null){
            perform.performance.push(req.body)
            perform.save()
            .then((data)=>{
                res.statusCode=200;
                res.setHeader('Content-Type','application/json')
                res.json(data)

            },(err)=>next(err))
        }
        else{
            err=new Error('Leader'+ req.params.leaderId+' Not Found');
            res.statusCode=404;
            return next(err)
        }
        },(err)=>next(err))
        .catch((err)=>next(err))
        
    })

.put(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    res.statusCode = 403;
    res.end('PUT operation not supported on /leader/'+ req.params.leaderId);

})
.delete(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Leader.findById(req.params.leaderId)
    .then((data)=>{
        if(data!=null){
            for(var i=(data.performance.length -1);i>=0;i--){
                data.performance.id(data.performance[i]._id).remove();
            }
            data.save()
            .then((data)=>{
                res.statusCode=200;
                res.setHeader('Content-Type','application/json')
                res.json(data);

            },(err)=>next(err))
        }
        else{
            err=new Error('leader'+ req.params.leaderId+' Not Found');
            res.statusCode=404;
            return next(err)
        }
    },(err)=>next(err))
    .catch((err)=>next(err))
})
leaderRouter.route('/:leaderId/performance/:performanceId')
.get((req,res,next)=>{
    Leader.findById(req.params.leaderId)
    .then((data)=>{
        if(data!=null && data.performance.id(req.params.performanceId)!=null){
            res.statusCode=200;
            res.setHeader('Content-Type','application/json')
            res.json(data.performance.id(req.params.performanceId))
        }
        else if(data == null){
            err=new Error('data'+ req.params.leaderId+' Not Found');
            res.statusCode=404;
            return next(err)
        }
        else{
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);
        }

    },(err)=>next(err))
    .catch((err)=>next(err))   
})
.post(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    res.statusCode = 403;
    res.end('POST operation not supported on /Leader/'+ req.params.leaderId
        + '/performance/' + req.params.performanceId);
    })

.put(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Leader.findById(req.params.leaderId)
    .then((data)=>{
        if(data!=null){
            if(req.body){
                 data.performance=req.body
                 data.save()
                .then((data)=>{
                res.statusCode=200
                res.setHeader('Content-Type','application/json')
                res.json(data)
            },(err)=>next(err))
            }
            else if(req.body.rating){
                data.performance.id(req.params.performanceId).rating=req.body.rating
                data.save()
                .then((data)=>{
                    res.statusCode=200
                    res.setHeader('Content-Type','application/json')
                    res.json(data)
                },(err)=>next(err))
            }
            else{
                res.end("Error")
            }            
        
        }
    },(err)=>next(err))
    .catch((err)=>next(err))    
})
.delete(authenticate.verifyUser,authenticate.verifyAdmin,(req,res,next)=>{
    Leader.findById(req.params.leaderId)
    .then((data)=>{
            if(data!=null && data.performance.id(req.params.performanceId)!=null){
                data.performance.id(req.params.performanceId).remove();
                dish.save()
                .then((data)=>{
                    res.statusCode=200;
                    res.setHeader('Content-Type','application/json')
                    res.json(data);
    
                },(err)=>next(err))
            }
            else if(data==null){
                err=new Error('PerformaceId'+ req.params.performanceId+' Not Found');
                res.statusCode=404;
                return next(err)
            }
            else{
                err=new Error('Performance'+ req.params.performanceId+' Not Found');
                res.statusCode=404;
                return next(err)
            }
        })
    })


module.exports=leaderRouter;