const UserModel = require('../models/Users')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const shortid=require('shortid')
const Users = require('../models/Users')

module.exports.register = async (req,res,next)=>{
    try{
    const {name,email,password} = req.body
    if(!name||!email||!password)
        return res.status(400).send({message:"All Fields are required!"})
    const exist = await Users.findOne({email:email})
    if(exist)
        return res.status(400).send({message:"A User Already exists with this email"})
    const salt =await bcrypt.genSaltSync(10)
    const hashedPassword=await bcrypt.hash(password,salt)
    const user = new Users({name:name,email:email,password:hashedPassword})
    await user.save()
    res.send({message:"Registered Successfully!"})
    }catch(err){
        console.log(err)
        req.error = "DEFAULT"
        next()
    }
}

module.exports.login= async (req,res,next)=>{
    if(!req.body.email||!req.body.password){
        req.error = "USER_AUTH"
        return next()
    }

    const {email,password} = req.body
    const result=await Users.findOne({email:email})

    if(!result){
        req.error = "INVALID"
        return next()
    }
    console.log(password,result)
    const check =await bcrypt.compare(password,result.password)

    if(!check){
        req.error = "INVALID"
        return next()
    }
       

    const token=jwt.sign({id:result._id},process.env.JWT_SECRET,{
        expiresIn:60*60*24,
    })

    res.cookie("token",token,{ httpOnly: true })
    res.send({message:"Successful",user:{name:result.name,_id:result._id,email:result.email}})
}

module.exports.logout=async (req,res)=>{
    res.clearCookie("token");
    res.send({message:"Successful"})
}

module.exports.userProfile = async (req,res,next)=>{
    const id = req.params.id
    const user = await Users.findOne({_id:id},{password:0})
    if(!user){
        req.error = "NOT_FOUND"
        return next()
    }
    res.send({user,message:"Found"})
}

module.exports.checkLogin=async (req,res,next)=>{
    
    if(req.body.userId){
    const user = await Users.findOne({_id:req.body.userId},{password:0,})
       return res.send({logged:true,user})
    }
    res.status(404).send({logged:false})
}

