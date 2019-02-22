const express = require("express");
const router = express.Router();
const Message = require("../controllers/message");
const {loginRequired} = require("../controllers/middleware");

router.post("/", loginRequired, Message.createMessage);

module.exports = router;