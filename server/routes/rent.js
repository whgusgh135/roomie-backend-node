const express = require("express");
const router = express.Router();
const Rent = require("../controllers/rent");
const { loginRequired, ensureCorrectuser } = require("../controllers/middleware");

const multer = require("multer");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads')
    },
    filename: function (req, file, cb) {
      cb(null, Date.now() + file.originalname);
    }
});

const upload = multer({ storage: storage });

router.get("/", Rent.getRents);
router.get("/:id", Rent.selectRent);
router.post("/", loginRequired, upload.array('rentImages', 5), Rent.createRents);
router.put("/:id/:rentId", loginRequired, ensureCorrectuser, upload.array('rentImages', 5), Rent.updateRent);
router.delete("/:id/:rentId", loginRequired, ensureCorrectuser, Rent.deleteRent);

module.exports = router;