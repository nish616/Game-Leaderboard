const router = require("express").Router();
const bcrypt = require("bcrypt");

const User =  require("../models/user"); //User collection
const Game = require("../models/game"); // Game collection
const Result = require("../models/result"); // result collection

const mongoose = require("mongoose");

//import authorization function
const authorize = require("../middlewares/authorize");


router.get("/dashboard", authorize, async(req,res) => {
    // find and send all the available games in the DB
    const games = await Game.find();
    res.json(games);
});

router.get("/dashboard/:id", authorize, async(req, res) => {
    try{
        const gameId = req.params.id;

        const users = await findAllUsers(gameId);

        function UserData(id,wins,points){
            this.userId = id,
            this.userWins = wins,
            this.userPoints = points
        }

        const ranking = [];

        for(const user of users){
            const id = user._id;
            const wins = await getTotalWins(user._id, gameId);
            const points = await getTotalScore(user._id, gameId);

            const newUser = new UserData(id,wins,points);

           ranking.push(...[newUser]);
        }

        function compare( a, b ) {
            if ( a.userWins < b.userWins ){
              return 1;
            }
            if (a.userWins > b.userWins ){
              return -1;
            }
            return 0;
          }
          
          ranking.sort( compare );

        
        res.status(200).send(ranking);

    }catch(err){
        if(err) throw err;
    }

});

///update user profile except Phone number
router.patch("/dashboard/profile", authorize, async(req, res) => {
    const user = req.user;
    const userId = user.split(' ')[0];
    const {password, name , age , location , email} = req.body;

    //Hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    User.updateMany({_id : userId }, {$set : { password : hashedPassword, name : name, age : age, location : location, email : email}} , (err, docs) => {
       if(err) return res.status(400).send("Updattion failed!");

       if(docs) return res.status(200).send("User updated!");
   });

});

async function findAllUsers(gId){
    try{
        //performing union of u1Id and u2Id to retrieve all the players participated in the game
    let users = await Result.aggregate([
        {$match : {gameId : new mongoose.Types.ObjectId(gId) }},
        {$project : {uId : "$u1Id", _id : 0}},
        {$unionWith :  {coll : "results", pipeline : [{$match : {gameId : new mongoose.Types.ObjectId(gId) }}, { $project : { uId : "$u2Id", _id : 0}} ]}},
        {$group : { _id : "$uId"}}
    ]);

    return users;
    
    }catch(err) {
        if(err) throw err;
    }
    
}

async function getTotalWins(uId, gId) {

    try{

        let getWins = await  Result.aggregate([
            {$match : { winner : new mongoose.Types.ObjectId(uId), gameId : new mongoose.Types.ObjectId(gId)}},
            { $count : "winner" }
        ]);

        const wins = getWins.length == 0 ? 0 : getWins[0].winner;
    
        return wins;
    

    }catch(err) {
        if(err) throw err;
    }

}

async function getTotalScore(uId,gId){

    try{
        let getU1Score = await Result.aggregate([
            {$match : {u1Id : new mongoose.Types.ObjectId(uId), gameId : new mongoose.Types.ObjectId(gId)}},
            {$group : { _id : "$u1Id" , totalscore : { $sum : "$scoreU1" }}}
            
        ]);

        const u1Score = getU1Score.length == 0 ? 0 : getU1Score[0].totalscore;

        let getU2Score = await Result.aggregate([
            {$match : {u2Id : new mongoose.Types.ObjectId(uId), gameId : new mongoose.Types.ObjectId(gId)}},
            {$group : { _id : "$u2Id" , totalscore : { $sum : "$scoreU2" }}}
             
        ]);


        const u2Score = getU2Score.length == 0 ? 0 : getU2Score[0].totalscore; 
        
        const totalScore = u1Score + u2Score;

        return totalScore;

    }catch(err){
        if(err) throw err;
    }

    
}



module.exports = router;