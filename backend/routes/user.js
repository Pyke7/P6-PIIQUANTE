const express = require('express');
const router = express.Router();
const password = require('../middleware/password');
const userCtrl = require('../controllers/user');

router.post('/signup', password, userCtrl.signup); //route pour s'inscrire  
router.post('/login', userCtrl.login); //route pour se connecter

module.exports = router;