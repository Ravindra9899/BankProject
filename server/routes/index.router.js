const express = require('express');
const router = express.Router();

const ctrlUser = require('../controllers/user.controller');

const jwtHelper = require('../config/jwtHelper');

router.post('/register', ctrlUser.register);
router.post('/authenticate', ctrlUser.authenticate);
router.get('/userProfile',jwtHelper.verifyJwtToken, ctrlUser.userProfile);
router.post('/depositAmt', ctrlUser.depositAmt);
router.post('/WithdrawAmt', ctrlUser.WithdrawAmt);
router.post('/checkBalance', ctrlUser.checkBalance);
router.post('/sendVerificationLink', ctrlUser.sendVerificationLink);
router.post('/getTransactions', ctrlUser.getTransactions);
router.post('/resetPassword', ctrlUser.resetPassword);



module.exports = router;



