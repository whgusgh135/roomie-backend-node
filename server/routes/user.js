const express = require("express");
const router = express.Router();
const User = require("../controllers/user");

router.post("/auth", User.authenticate);
router.post("/register", User.register);
router.put("/changePassword", User.changePassword);

module.exports = router;