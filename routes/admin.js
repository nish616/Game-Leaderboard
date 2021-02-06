const router = require("express").Router();
const Game = require("../models/game"); //Game collection
const Result = require("../models/result"); // result collection

//import authorization function
const authorize = require("../authorize");

router.get("/admin", authorize, (req,res) => {
    //console.log(req.headers['auth-token']);
    const user = req.user;
    const userId = user.split(' ')[0];
    const roleId = user.split(' ')[1];
    // console.log("User ID ->" + userId);
    // console.log("Role ID -> " + roleId);

    if(roleId != "000") return res.status(403).send("Acess denied");
    
    res.json({"mydata" : "This is a data"});
});

// route to post game results
router.post("/admin/results", authorize, (req, res) => {
    
    // Getting roleId to authorize admin
    const user = req.user;
    const roleId = user.split(' ')[1];

    if(roleId != "000") return res.status(403).send("Acess denied");

    const {u1Id, u2Id, scoreU1, scoreU2, win , gameId} = req.body;

    const newResult = {
        u1Id : u1Id,
        u2Id : u2Id,
        scoreU1 : scoreU1,
        scoreU2 : scoreU2,
        win : win,
        gameId : gameId
    };

    const result = new Result(newResult);

    result.save().then(() => {
        res.status(201).send("Result posted");
    })
    .catch((err) => {
        if(err) throw err;

        res.status(400).send("Adding result failed!");
    });



});

// route to add games 
router.post("/admin/games", authorize, async (req, res) => {
    const {name , difficulty} = req.body;
    const user = req.user;
    const roleId = user.split(' ')[1];

    if(roleId != "000") return res.status(403).send("Acess denied");

    const newGame = {
        name : name,
        difficulty : difficulty
    };

    const game = new Game(newGame);
    await game.save().then(() => {
        res.status(200).send("Game added!");
    })
    .catch((err) => {
        if(err) return res.status(400).send("Adding game failed!");
    });

});




module.exports = router;