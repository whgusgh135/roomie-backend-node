const express = require("express");
const router = express.Router();
const User = require("../controllers/user");
const {loginRequired} = require("../controllers/middleware");

router.post("/auth", User.authenticate);
router.post("/register", User.register);
router.put("/changePassword", loginRequired, User.changePassword);

module.exports = router;