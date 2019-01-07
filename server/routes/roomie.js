const express = require("express");
const router = express.Router();
const Roomie = require("../controllers/roomie");

router.get("/:id", Roomie.findRoomie);
router.post("/", Roomie.createRoomie);

module.exports = router;