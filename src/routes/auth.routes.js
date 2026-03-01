const express = require("express");
const router = express.Router();
const { register, login, getProfile, updateProfile } = require("../controllers/auth.controller");

router.post("/signup", register);
router.post("/login", login);
router.get("/profile", getProfile);
router.put("/profile", updateProfile);

module.exports = router;