const jwt = require("jsonwebtoken")
const axios = require('axios')

module.exports.verifyToken=async (req,res,next)=>{
    const token = await req?.cookies?.token||""
    console.log(req.cookies)
    if(token===""||!token)
        return res.status(400).send({isLogged:false})
    
    const check=await jwt.verify(token,process.env.JWT_SECRET)
    console.log(check)
    if(!check)
        return res.status(400).send({isLogged:false})
    console.log("CHECK",check)
    req.body.userId=check.id
    next();
}
module.exports.verifyTokenExternal=async (req,res,next)=>{
    let isAllowed;
    let user;
    await axios.post('https://thawing-temple-60747.herokuapp.com/verify/'+token).then((res)=>{
        if(res.data.isAllowed){
            isAllowed = true
            user = res.data.user
        }
    }).catch(err=>console.log(err?.response))
    if(!isAllowed)
        return res.send({message:"You Are Not Allowed"})
    req.user = user
    next();
}
