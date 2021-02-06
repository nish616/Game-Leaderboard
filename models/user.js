const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    phoneNumber : {
        type: Number,
        min : 10,
        required : true
    },
    
    password : {
        type : String,
        required : true
    },

    name : {
        type : String,
        required : false
    },
    age : {
        type : Number,
        required : false
    },
    location : {
        type : String,
        required : false
    },
    email : {
        type : String,
        required : false
    },
    roleId : {
        type : String,
        required : true
    }

});

module.exports = mongoose.model("User", userSchema);