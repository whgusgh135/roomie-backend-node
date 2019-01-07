const express = require("express");
const router = express.Router();
const Roomie = require("../controllers/roomie");

router.get("/", Roomie.getRoomies)
router.get("/:id", Roomie.selectRoomie);
router.post("/", Roomie.createRoomie);
router.put("/:id", Roomie.updateRoomie);
router.delete("/:id", Roomie.deleteRoomie);

module.exports = router;