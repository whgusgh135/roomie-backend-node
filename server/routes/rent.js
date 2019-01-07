const express = require("express");
const router = express.Router();
const Rent = require("../controllers/rent");

router.get("/", Rent.getRents);
router.get("/:id", Rent.selectRent);
router.post("/", Rent.createRents);
router.put("/:id", Rent.updateRent);
router.delete("/:id", Rent.deleteRent);

module.exports = router;