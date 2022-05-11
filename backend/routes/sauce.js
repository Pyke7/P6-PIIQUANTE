const express = require('express');
const router = express.Router();
const multer = require('../middleware/multer-config');
const sauceCtrl = require('../controllers/sauce');
const auth = require('../middleware/auth');

router.post('/', auth, multer, sauceCtrl.createSauce);      //C
router.get('/', auth, sauceCtrl.getAllSauces);              //R 
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.put('/:id', auth, multer, sauceCtrl.updateSauce);    //U
router.delete('/:id', auth, sauceCtrl.deleteSauce);         //D
router.post('/:id/like', auth, sauceCtrl.likeOrDislike);

module.exports = router;