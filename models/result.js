const mongoose = require("mongoose");

const resultSchema = new mongoose.Schema({
    
    u1Id : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    },
    u2Id : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    },
    scoreU1 : {
        type : Number,
        required : true
    },
    scoreU2 : {
        type : Number,
        required : true
    },
    winner : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    },
    gameId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    }

});

module.exports = mongoose.model("Result", resultSchema);