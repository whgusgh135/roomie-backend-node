const express = require("express");
const router = express.Router();
const Message = require("../controllers/message");
const {loginRequired, ensureCorrectuser} = require("../controllers/middleware");

router.get("/", loginRequired, ensureCorrectuser, Message.selectMessages);
router.post("/", loginRequired, Message.createMessage);

module.exports = router;