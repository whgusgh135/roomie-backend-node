const Message = require("../models/message");
const Roomie = require("../models/roomie");
const User = require("../models/user");

// CREATE route - api/message
exports.createMessage = async function(req, res, next) {
    try {
        let { message, roomieId } = req.body;
        let user = await User.findById(res.locals.userId).populate("roomie");

        let newMessage = new Message({
            message: message,
            from: user.roomie._id,
            date: Date.now()
        });

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

// READ route - api/message
exports.selectMessages = async function(req, res, next) {
    try {
        let user = await User.findById(res.locals.userId).populate("rent").populate({
            path: "roomie",
            populate: { path: "messages"}
        });

        let messages = user.roomie.messages;
        return res.json(messages);
    } catch(error) {
        return next({
            status: 400,
            message: error.message
        });
    }
}

// UPDATE route - api/message/:id
exports.readMessage = async function(req, res, next) {
    try {
        let user = await User.findById(res.locals.userId).populate("rent").populate({
            path: "roomie",
            populate: { path: "messages"}
        });

        let index = user.roomie.messages.findIndex(message => message._id == req.body.id);

        user.roomies.messages[index].read = true;

        await User.updateOne({_id: res.locals.userId}, user);

        return res.json(user.roomie.messages);

    } catch(error) {
        return next({
            status: 400,
            message: error.message
        });
    }
}

// DELETE route - api/message/:id/:msgId
exports.deleteMessage = async function(req, res, next) {
    try {
        let user = await User.findById(res.locals.userId).populate("rent").populate({
            path: "roomie",
            populate: { path: "messages"}
        });

        user.roomie.messages = user.roomie.messages.filter(message => message._id != req.params.msgId);
    
        await Roomie.updateOne({_id: user.roomie._id}, user.roomie);
        await Message.findById(req.params.msgId).remove();

        return res.json(user.roomie.messages);

    } catch (error) {
        return next({
            status: 400,
            message: error.message
        });
    }
}