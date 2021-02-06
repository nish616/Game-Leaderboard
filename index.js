const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

//import routes
const authRoute = require("./routes/authenticate");
const gamesRoute = require("./routes/games");
const adminRoute = require("./routes/admin");

const app = express();

//middleware
app.use(bodyParser.urlencoded({
    extended : true
}));
app.use(bodyParser.json());

//Route middleware
app.use("/", authRoute);
app.use("/games/", gamesRoute);
app.use("/", adminRoute);

app.listen(3000, console.log("Server up and running!"));