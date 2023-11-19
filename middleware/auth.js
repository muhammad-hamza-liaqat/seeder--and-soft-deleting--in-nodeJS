const jwt = require('jsonwebtoken');
require("dotenv").config();

const verifyToken = async (req,res,next)=>{
    const token = req.body.token || req.query.token || req.headers["authorization"]

    if (!token){
        return res.status(400).json({ message: "token required!"})
    }
    try{

        const decode = jwt.verify(token, process.env.secret_key);
        req.user = decode;

    }
    catch(err){
        res.status(400).send({message: "invalid token!"})
    }
    return next();
}


module.exports = verifyToken