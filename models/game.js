const mongoose = require("mongoose");

const gameSchema = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    difficulty : {
        type : String,
        required : false
    }

});

module.exports = mongoose.model("Game", gameSchema);