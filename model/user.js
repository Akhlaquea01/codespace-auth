// const { default: mongoose } = require("mongoose");
const { default: mongoose } = require("mongoose");
const moongse=require("mongoose");

const userSchema=new mongoose.Schema({
    firstname:{
        type:String,
        default:null
    },
    lastname:{
        type:String,
        default:null
    },
    email:{
        type:String,
        unique:true
    },
    password:{
        type:String,
    },
    // TODO: later
    token:{
        type:String,
        default:null
    }
})

module.exports=mongoose.model("user",userSchema);