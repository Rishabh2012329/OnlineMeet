const Room = require('../models/Rooms')

module.exports.addMembers = (req,res)=> {
    
}

module.exports.addMembersExternal = async (req,res)=> {
    const {email,roomId} = req.body
    let room = await Room.findOne({_id:roomId})
    room.members.push(email)
    await room.save()
    res.send({message:"Successfuly"})
}

module.exports.createRoom = async (req,res)=> {
    try{
        const {members,name} =  req.body
        const room = new Room({
            email:members,
            name:name,
            uid:req.body.userId
        })
        await room.save()
        res.send({message:"Room Created Successfully",room})
    }catch(err){
        console.log(err)
        req.error = "DEFAULT"
        next()
    }
}

module.exports.createRoomExternal = async (req,res)=> {
    try{
        const {members,courseId} =  req.body
        const room = new Room({
            email:members,
            uid:courseId
        })
        await room.save()
        res.send({message:"Room Created Successfully",roomId:room._id})
    }catch(err){
        console.log(err)
        req.error = "DEFAULT"
        next()
    }
}

module.exports.notifyMembers = (req,res)=> {
    
}

module.exports.deleteRoom = async (req,res)=> {
    const id = req.params.id
    const result = await Room.deleteOne({_id:id})
    res.send({message:"Deleted"})
}

module.exports.getRooms = async (req,res)=> {
    try{
        const rooms = await Room.find({
            uid:req.body.userId
        })
        res.send({message:"Found",rooms})
    }
    catch(err){
        console.log(err)
    }
}