const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req, res, next) => {
  // Get token=> decode=> user_id/error
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, "kminacademy");
    const user = await User.findOne({
      _id: decoded._id,
      "tokens.token": token,
    });
    //name,email,password,tokens[
    //{token:'..'}
    //]
    //"tokens.token='"
    if (!user) {
      throw new Error();
    }
    req.user = user;
    req.token = token;
    //req.query,params
    //object.key = value
    next();
  } catch (err) {
    res.status(401).send({ error: "Please authenticate." });
  }
};

module.exports = auth;

//1. Middleware flow
//
//without middleware : new request => run route handler
//
//with middleware : new request => do something => run route handler
//
//2. Middleware params (req,res,next)
//
//3. Will receive token from client in Header (Authorization)
//
//4. Decoded token to verify token is valid
//
//5. _id (user)
//
//6. find user by _id and token
//
//7. If(token)=> valid / else => invalid
//
//8. Add middle for special Route
