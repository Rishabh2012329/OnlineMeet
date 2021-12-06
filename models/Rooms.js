const mongoose = require('mongoose')
const Types = mongoose.SchemaTypes

const roomSchema = mongoose.Schema({
    email:{
        type:Array,
        default:[]
    },
    uid:{
        type:Types.ObjectId,
        ref:"users"
    },
    name:{
        type:String,
        require:true
    }
})

const RoomModel = mongoose.model('rooms',roomSchema)
module.exports = RoomModel