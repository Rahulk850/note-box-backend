var jwt = require('jsonwebtoken');
const JWT_SECRET = "extraordinaryrahul";

const fetchUser = (req,res,next)=>{
    // get the user from auth-token and add id to the req object
    const token = req.header('auth-token');
    if(!token){
        return res.status(401).json({error: "Please authenticate using valid token"})
    }
    try {
        const data = jwt.verify(token,JWT_SECRET);
        req.user = data.user;
        next();
    } catch (error) {
        return res.status(401).json({error: "Please authenticate using valid token"})
    }
    }
module.exports = fetchUser;