const express = require("express");
const router = express.Router();
const Roomie = require("../controllers/roomie");
const {loginRequired} = require("../controllers/middleware");

router.get("/", Roomie.getRoomies)
router.get("/:id", Roomie.selectRoomie);
router.post("/", loginRequired, Roomie.createRoomie);
router.put("/:id", Roomie.updateRoomie);
router.delete("/:id", Roomie.deleteRoomie);

module.exports = router;