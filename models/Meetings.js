const mongoose = require('mongoose')
const Types = mongoose.SchemaTypes

const meetingSchema = mongoose.Schema({
    startTime:{
        type:Types.Date,
        require:true
    },
    endTime:{
        type:Types.Date,
        require:true
    },
    date:{
        type:Types.Date,
        require:true
    },
    roomId:{
        type:Types.ObjectId,
        ref:'rooms'
    }
})

const meetingModel = mongoose.model('meeting',meetingSchema)
module.exports = meetingModel