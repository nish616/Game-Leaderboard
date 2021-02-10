const jwt = require("jsonwebtoken");

function authorize(req, res, next){
    const authHeader = req.headers['auth-token'];
    if(authHeader == null) return res.status(401).send("Acess denied!");

    const acessToken = authHeader.split(' ')[1];
    //console.log("acessToken->" +acessToken);

    jwt.verify(acessToken, process.env.TOKEN_SECRET, (err, user) => {
        if(err) return res.sendStatus(403);
        //console.log(user);
        req.user = user.token_id;
        next();
    });

    //console.log(acessToken);
}

module.exports = authorize;