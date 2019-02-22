const Message = require("../models/message");
const Roomie = require("../models/roomie");
const User = require("../models/user");

// CREATE route - api/message
exports.createMessage = async function(req, res, next) {
    try {
        let { message, roomieId } = req.body;
        let user = await User.findById(res.locals.userId).populate("roomie");
        console.log(message);
        let newMessage = new Message({
            message: message,
            from: user.roomie
        });

        console.log(newMessage);
        await newMessage.save();

        // Find the roomie who is going to receive the message
        let sentTo = await Roomie.findById(roomieId);
        sentTo.messages.push(newMessage);
        await sentTo.save();
        
        return res.json({"message": "sent"});

    } catch(error) {
        return next({
            status: 400,
            message: error.message
        });
    }
}