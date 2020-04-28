const mongoose = require('mongoose');
const passport = require('passport');
const _ = require('lodash');

const User = mongoose.model('User');
const Image = require('./../models/image.module');

//  let data = [{a: 1, b: 'str', c: true, d: 999}, {b: String}]
// var elem={b:_.map(_.filter(data,{b:'str'}),'b')[0]};
// console.log(elem,'hhghghghghhghg');


// let data2 = [{a: 1, b: 'str', c: true, d: 999}, {a: Number, b: String, c: Boolean}]
// // output { a: 1, b: 'str', c: true }
// var elem1={a:_.map(_.filter(data2,{a:1}),'a')[0]};
// var elem2={b:_.map(_.filter(data2,{b:'str'}),'b')[0]};
// var elem3={c:_.map(_.filter(data2,{c:true}),'c')[0]};


// let data3 = [{a: 1, b: 'str', c: true, d: 999}, {a: Boolean, b: Number}]
// var elem1={a:_.map(_.filter(data2,{a: true}),'a')[0]};
// var elem2={b:_.map(_.filter(data2,{b: 1}),'b')[0]};




module.exports.register = (req, res, next) => {
    var user = new User();
    user.fullName = req.body.fullName;
    user.email = req.body.email;
    user.password = req.body.password;
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
                return res.status(200).json({ status: true, user : _.pick(user,['fullName','email']) });
        }
    );
}



//--------------------Image Upload----------------
var path = require('path');
var formidable = require("formidable");



var imageUrl = './public/assets/uploads';
exports.saveImageDocument = async function (req, res) {
    var completeFlag = false;
    const form = new formidable.IncomingForm();
    form.uploadDir = imageUrl;
    form.keepExtensions = true;
    var pathSeparator = path.sep;
    let count = 0;
    form.on('error', (err) => {
        console.log('error', err);
    });
    form.parse(req, async function (err, fields, files) {
        let multipleUpload = new Promise(async (resolve, reject) => {
            let newImgUrls = [];
            if (Object.keys(files).length > 0) {
                for (var field in files) {
                    var fileType = files[field].type.substring(0, 5);
                    if (fileType == 'image') {
                        if (files[field].path) {
                            var filePATH = `${files[field].path}`.replace('public/', '');
                            count++;
                            newImgUrls.push({
                                'name': filePATH
                            })
                            if (count == Object.keys(files).length) {
                                completeFlag = true;
                                resolve(newImgUrls);
                            }
                        }
                    } else {
                        res.json({
                            code: 500,
                            message: "Invalid image format."
                        })
                    }
                }
            }
        });
        let upload = await multipleUpload;
        if (upload && completeFlag) {

            res.json({
                code: 200,
                message: "Images upload successfully.",
                data: upload

            })
        } else {
            res.json({
                code: 500,
                message: "An occured while uploading images."
            })
        }
    })
}
//------------END--------------------

//-------Add Product--------------
exports.saveImagedata = function (req, res) {
    var data = req.body.Name.more;
  
    console.log('dataRohitssss', data);
    var newImage = new Image({

        groups: req.body.Name.more
      
        // name : data.Name,
        // image: data.ProductImage,
    
    });
    console.log(newImage,'ashdagdhjsgdjsagd');
        newImage.save(function (saveErr, savedata) {
        if (saveErr) {
            var outputJson = {
                status: 400,
                message: saveErr,
            }
            return res.json(outputJson);
        } else {
            var outputJson = {
                status: 200,
                data: savedata,
                msg: "Product Added successful"
            }
            return res.json(outputJson);
        }
    })
}
//----------------END------------------------