const express = require("express");
const router = express.Router();
const Message = require("../controllers/message");
const {loginRequired, ensureCorrectuser} = require("../controllers/middleware");

router.get("/:id", loginRequired, ensureCorrectuser, Message.selectMessages);
router.post("/", loginRequired, Message.createMessage);
router.delete("/:id/:msgId", loginRequired, Message.deleteMessage)

module.exports = router;