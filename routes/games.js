const router = require("express").Router();
const User =  require("../models/user");
const bcrypt = require("bcrypt");
const Game = require("../models/game"); // Game collection
const Result = require("../models/result"); // result collection

//import authorization function
const authorize = require("../authorize");


router.get("/dashboard", authorize, async(req,res) => {
    //console.log(req.headers['auth-token']);
    // const user = req.user;
    // const userId = user.split(' ')[0];
    // const roleId = user.split(' ')[1];
    // console.log("User ID ->" + userId);
    // console.log("Role ID -> " + roleId);

    // find and send all the available games in the DB
    const games = await Game.find();
    res.json(games);
});

router.get("/dashboard/:id", authorize, async(req, res) => {
    try{
        const gameId = req.params.id;

        const results = await Result.find({gameId : gameId});

        //performing union of u1Id and u2Id to retrieve all the players participated in the game
        let users = await Result.aggregate([
            {$project : {u1Id : 1, _id : 0}},
            {$unionWith :  {coll : "results", pipeline : [ { $project : { u2Id : 1, _id : 0}}]}}
            
        ]);
        
        console.log(users);

        res.send(results);
    }catch(err){
        if(err) return res.status(400).send(err);
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


module.exports = router;