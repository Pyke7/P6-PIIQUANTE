const express = require('express');
const router = express.Router();
const multer = require('../middleware/multer-config');
const sauceCtrl = require('../controllers/sauce');
const auth = require('../middleware/auth');

router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.post('/', auth, multer, sauceCtrl.addSauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);
router.put('/:id', auth, multer, sauceCtrl.modifySauce);
router.post('/:id/like', auth, sauceCtrl.addPreference);

module.exports = router;