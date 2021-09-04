//  importe  les elements
const express = require('express');
const rateLimit = require("../middleware/limite")
const router = express.Router();

const userCtrl = require('../controllers/user');
const passwordCheck = require('../middleware/password-check');

router.post('/signup',passwordCheck, userCtrl.signup);
router.post('/login',rateLimit.limiter, userCtrl.login);


//  exporte user router
module.exports = router;