const express = require("express");
const router = express.Router();
const Rent = require("../controllers/rent");
const {loginRequired} = require("../controllers/middleware");

router.get("/", Rent.getRents);
router.get("/:id", Rent.selectRent);
router.post("/", loginRequired, Rent.createRents);
router.put("/:id", Rent.updateRent);
router.delete("/:id", Rent.deleteRent);

module.exports = router;