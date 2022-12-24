const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  // grab token from cookie
  console.log(req.cookies);
  const token = req.cookies.token;
  // if no token stop there
  if (!token) {
    res.status(403).send("please login first");
  }
  // if token decode and get id
  try {
    const decode = jwt.verify(token, "attssecretstring");
    console.log(decode);
    req.user=decode
  } catch (error) {
    console.log(error);
    res.status(401).send("Invalid Token");
  }
  // query to db for userid

  return next();
};
module.exports = auth;
