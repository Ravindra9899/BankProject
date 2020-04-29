const mongoose = require('mongoose');
const passport = require('passport');
const _ = require('lodash');
const User = mongoose.model('User');
const transactionDetail = require('./../models/transactions.model');
const token = require('./../models/token.model');
var mailer = require('./../mailer/mailer');
var crypto = require('crypto');
const bcrypt = require('bcryptjs');
module.exports.register = (req, res, next) => {
    var user = new User();
    let accountNo = Math.floor(100000 + Math.random() * 900000000000);
    user.fullName = req.body.name;
    user.email = req.body.email;
    user.phone = req.body.phone;
    user.gender = req.body.gender;
    user.city = req.body.city;
    user.password = req.body.password;
    user.accountNo=accountNo;
    user.save((err, doc) => {
        if (!err)
            res.send(doc);
        else {
            if (err.code == 11000)
                res.status(422).send(['Duplicate email adrress found.']);
            else
                return next(err);
        }

    });
}

exports.depositAmt = (req, res, next) => {
    var email=req.body.email;
    transactionDetail.findOne({
        accountNo : req.body.accountNo,
        userId : req.body.userId})
        .sort({createdAt:-1})
        .exec((err, resp) => {
            if (resp) {
                 var object1 = new transactionDetail({
                        accountNo : req.body.accountNo,
                        userId : req.body.userId,
                        type : 'deposit',
                        transactionAmt:req.body.amount,
                        amount : resp.amount+req.body.amount
                })
                object1.save((err, doc) => {
                    if (!err){
                        var dmessage = 'Dear User <br><br> you have deposit : ' + doc.transactionAmt+' INR';
                        var dsubject = 'Deposit amount';
                        var mailAdmin = new mailer();
                        mailAdmin.sendMail(email, dmessage, dsubject);
                        res.send(doc);
                    } else {
                        res.send(err);
                    }

                });
            }else {
                 var object1 = new transactionDetail({
                        accountNo : req.body.accountNo,
                        userId : req.body.userId,
                        type : 'deposit',
                        transactionAmt:req.body.amount,
                        amount : req.body.amount
                })
                object1.save((err, doc) => {
                    if (!err){
                        var dmessage = 'Dear User <br><br> you have deposit : ' + doc.transactionAmt+' INR';
                        var dsubject = 'Deposit amount';
                        var mailAdmin = new mailer();
                        mailAdmin.sendMail(email, dmessage, dsubject);
                        res.send(doc);
                    }else {
                        res.send(err);
                    }

                });
            }
        })
   
}

exports.WithdrawAmt = (req, res, next) => {
    var email=req.body.email;
    transactionDetail.findOne({
        accountNo : req.body.accountNo,
        userId : req.body.userId})
        .sort({createdAt:-1})
        .exec((err, resp) => {
            if (resp) {
                 var object1 = new transactionDetail({
                        accountNo : req.body.accountNo,
                        userId : req.body.userId,
                        type : 'withdraw',
                        transactionAmt:req.body.amount,
                        amount : resp.amount-req.body.amount
                })
                object1.save((err, doc) => {
                    if (!err){
                        var wmessage = 'Dear User <br><br> you have withdraw : ' + doc.transactionAmt+' INR';
                        var wsubject = 'Withdraw amount';
                        var mailAdmin = new mailer();
                        mailAdmin.sendMail(email, wmessage, wsubject);
                        res.send(doc);
                    }else {
                        res.send(err);
                    }

                });
            }else {
                 var object1 = new transactionDetail({
                        accountNo : req.body.accountNo,
                        userId : req.body.userId,
                        type : 'withdraw',
                        transactionAmt:req.body.amount,
                        amount : req.body.amount
                })
                object1.save((err, doc) => {
                    if (!err){
                        var wmessage = 'Dear User <br><br> you have withdraw : ' + doc.transactionAmt+' INR';
                        var wsubject = 'Withdraw amount';
                        var mailAdmin = new mailer();
                        mailAdmin.sendMail(email, wmessage, wsubject);
                        res.send(doc);
                    }else {
                        res.send(err);
                    }

                });
            }
        })
   
}

exports.getTransactions = (req, res, next) => {
    transactionDetail.find({
        accountNo : req.body.accountNo,
        userId : req.body.userId,
        createdAt:{$gte:req.body.fromDate,$lte:req.body.toDate}
        })
        .sort({createdAt:-1})
        .exec((err, resp) => {
            if (resp.length>0) {
                res.send(resp);       
            }else {
                res.send(err);
            }
        })
   
}

exports.checkBalance = (req, res, next) => {
   transactionDetail.findOne({
        accountNo : req.body.accountNo,
        userId : req.body.userId})
        .sort({createdAt:-1})
        .exec((err, resp) => {
            if (resp) {
               res.send(resp);
            }else {
               res.send(err);
            }
        })
}

module.exports.sendVerificationLink = (req, res, next) => {
     var tokenDetail = new token({
        email : req.body.email,
        token: crypto.randomBytes(16).toString('hex')
    });
    tokenDetail.save((err, doc) => {
        if (!err){
                   var email = req.body.email;
                   var message = "Dear User,</br></br>Your reset passwork Link is given below, Please click on it and reset your password</br></br>Link : http://localhost:4200/reset-password/" + doc.token;
                   var subject = 'Regarding : Reset Password';
                   var mailerin = new mailer();
                   mailerin.sendMail(email, message, subject);
                   res.send(doc);
        }else {
              res.send(doc);
        }

    });
}

module.exports.resetPassword = (req, res, next) => {
    token.findOne({ token: req.body.token },
        (err, token) => {
            if (!token)
                return res.status(404).json({ status: false, message: 'token not found.' });
            else{
                var emailId=token.email;
                 bcrypt.genSalt(10, (err, salt) => {
                 bcrypt.hash(req.body.password, salt, (err, hash) => {
                            if (hash) {
                                User.updateOne({ email: emailId },
                                    {
                                        $set: { password: hash }
                                    }
                                ).exec((err, doc) => {
                                    if (doc) {
                                        var outputJSON = {
                                            status: 200,
                                            msg: 'Password Updated Successfully',
                                            data: doc
                                        }
                                        res.status(200).send(outputJSON);
                                    } else {
                                        var outputJSON = {
                                            status: 201,
                                            msg: 'Please Fill All Fields',
                                            data: err
                                        }
                                        res.status(201).send(outputJSON)
                                    }
                                });
                            } else {
                                next();
                            }
                    });
                });
            }
        }
    );
}

module.exports.authenticate = (req, res, next) => {
    // call for passport authentication
    passport.authenticate('local', (err, user, info) => {       
        // error from passport middleware
        if (err) return res.status(400).json(err);
        // registered user
        else if (user) return res.status(200).json({ "token": user.generateJwt() });
        // unknown user or wrong password
        else return res.status(404).json(info);
    })(req, res);
}

module.exports.userProfile = (req, res, next) =>{
    User.findOne({ _id: req._id },
        (err, user) => {
            if (!user)
                return res.status(404).json({ status: false, message: 'User record not found.' });
            else
                return res.status(200).json({ status: true, user : _.pick(user,['_id','accountNo','fullName','email','phone','gender','city']) });
        }
    );
}

