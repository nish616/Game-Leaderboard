const router = require("express").Router();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt =  require("jsonwebtoken");

const User =  require("../models/user");



mongoose.connect("mongodb+srv://"+process.env.DB_USER+":"+process.env.DB_PASSWORD+"@cluster0.ll1mc.mongodb.net/"+process.env.DB_NAME+"?retryWrites=true&w=majority",
{ useNewUrlParser: true,
useUnifiedTopology: true })
.then(() => {
    console.log("Database authenticated and connected");
})
.catch((err) => {
    if(err) throw err;
});



router.post("/register", async (req,res) => {
    const {phoneNumber, password} = req.body;

    //check if user already exists
    const numberExist = await User.findOne({phoneNumber : phoneNumber});
    if(numberExist) return res.status(400).send("Number already registered");

    //Hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);


    const newUser = {
        phoneNumber : phoneNumber,
        password : hashedPassword,
        roleId :  process.env.ROLE_ID
    };

    const user  = new User(newUser);
    user.save().then(() => {
        res.status(201).send("User registered!");
    })
    .catch((err) => {
        res.status(400).send(err);
    });
    
});

router.post("/login", async (req, res) => {
    
    const {phoneNumber, password} = req.body;
    //check if user  exists
    const user = await User.findOne({phoneNumber : phoneNumber});
    if(user == null) return res.status(400).send("Invalid number/password");

    //password check
    const validPass = await bcrypt.compare(password, user.password);
    if(!validPass) return res.status(400).send("Invalid number/password");

    //create and assign token
    const accessToken = jwt.sign({token_id : user._id +' '+user.roleId}, process.env.TOKEN_SECRET, {expiresIn: '120m'});
    
    res.status(200).json({"auth-token" : accessToken});
    
})

module.exports = router;