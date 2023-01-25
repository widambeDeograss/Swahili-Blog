const express = require("express");
const router = express.Router();
const {register_user, registerView, loginView, logotView, login_user} =  require("../controllers/blogControler");


module.exports = router;