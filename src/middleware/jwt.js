import jwt from "jsonwebtoken";

const verifyAccessToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token)
      return res
        .status(401)
        .json({ stautsCode: 401, message: "Access Denied" });

    if (token.startsWith("Bearer "))
      token = token.slice(7, token.length).trimLeft();

    const payload = jwt.verify(token, process.env.JWT_ACCESS_KEY);

    req.user = payload;
    next();
  } catch (err) {
    res.status(401).json({ stautsCode: 401, message: err.message });
  }
};

const verifyRefreshToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token)
      return res
        .status(401)
        .json({ stautsCode: 401, message: "Access Denied" });

    if (token.startsWith("Bearer "))
      token = token.slice(7, token.length).trimLeft();

    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.user = payload;
    req.refreshToken = token;
    next();
  } catch (err) {
    res.status(401).json({ stautsCode: 401, message: err.message });
  }
};

const verifyLoggedIn = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (token.startsWith("Bearer "))
      token = token.slice(7, token.length).trimLeft();

    const payload = jwt.verify(token, process.env.JWT_ACCESS_KEY);

    req.user = payload;
    next();
  } catch (err) {
    next();
  }
};

export { verifyAccessToken, verifyRefreshToken, verifyLoggedIn };
