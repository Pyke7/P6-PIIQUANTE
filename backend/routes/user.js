const express = require('express');
const router = express.Router();
const limiter = require('../middleware/express-rate-limit');
const password = require('../middleware/password');
const userCtrl = require('../controllers/user');

router.post('/signup', password, userCtrl.signup); //route pour s'inscrire  
router.post('/login', limiter, userCtrl.login); //route pour se connecter

module.exports = router;