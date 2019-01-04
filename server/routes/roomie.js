const express = require("express");
const router = express.Router();
const Roomie = require("../controllers/roomie");

router.get("/:id", Roomie.findRoomie);
router.post("/new", Roomie.createRoomie);

module.exports = router;