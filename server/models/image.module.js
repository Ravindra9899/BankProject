const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

var imageSchema = new mongoose.Schema({

    Images :{
        type : Array
    },

    groups: [{
        p_name: {
            'type': String, 
        },
        image:Array
    }],


});



module.exports=mongoose.model('Image', imageSchema);