const mongoose=require('mongoose');
const Schema=mongoose.Schema;

const LeaderPerformance=new Schema({
    rating:{
        type:Number,
        max:5,
        min:1,
        // required:true
    },
    Comment:{
        type:String,
        // required:true
    },
    Experience:{
        type:String,
        // required:true
    },
    Achivment:{
        type:String
    },
    designation:{
        type:String,
        // required:true
    }

},
{
    timestamps: true
})



const leaderSchema=new Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    image:{
        type:String,
        required:true,
    },
    designation:{
        type:String,
        required:true
    },
    abbr:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    featured:{
        type:Boolean,
        default:false
    },
    performance:[LeaderPerformance]
},
{
    timestamps: true
})
const Leader=mongoose.model('Leader',leaderSchema);
module.exports=Leader;