const express = require("express");
const router = express.Router();
const AuthControl = require('../controllers/AuthController')

router.post('/register', AuthControl.register)


module.exports = app => app.use("/auth", router);