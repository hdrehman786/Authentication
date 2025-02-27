import jwt from 'jsonwebtoken';

export const userAuth = (req, res, next) => {
  const token = req.cookies.token;
  console.log('Token:', token); // Debug to see if token is received
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }
  try {
    const decodedToken = jwt.verify(token, process.env.SECRET_KEY);
    const userId = decodedToken.userId;
    if (userId) {
      req.body.userId = userId;
      next();
    } else {
      return res.status(401).json({ msg: "Unauthorized, login again" });
    }
  } catch (err) {
    console.error(err);
    return res.status(401).json({ msg: "Token is not valid" });
  }
};