const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true
    },
    rooms:{
        type:Array,
        require:true
    }
})

const UserModel = mongoose.model('users',UserSchema)
module.exports = UserModel