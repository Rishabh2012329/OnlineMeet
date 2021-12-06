const Meeting = require('../models/Meetings')

module.exports.sheduleMeeting = async (req,res)=> {
    const {startTime,endTime,date,roomId} = req.body
    const meeting = new Meeting({
        start:startTime,
        endTime:endTime,
        roomId:roomId,
        date:date
    })
    await meeting.save()
    res.send({message:"Meeting Sheduled"})
}