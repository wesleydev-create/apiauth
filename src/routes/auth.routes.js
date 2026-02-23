const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller"); // caminho correto

router.post("/register", authController.register); // deve existir e ser função
router.post("/login", authController.login);       // deve existir e ser função

module.exports = router;