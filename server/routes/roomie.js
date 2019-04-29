const express = require("express");
const router = express.Router();
const Roomie = require("../controllers/roomie");
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



router.get("/", Roomie.getRoomies)
router.get("/:id", Roomie.selectRoomie);
router.post("/", loginRequired, upload.single('profileImage'), Roomie.createRoomie);
router.put("/:id", loginRequired, ensureCorrectuser, upload.single('profileImage'), Roomie.updateRoomie);
router.delete("/:id", loginRequired, Roomie.deleteRoomie);

module.exports = router;