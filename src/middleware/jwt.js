import jwt from "jsonwebtoken";

// ** Constants
import { authConstant } from "../constant";

const verifyAccessToken = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token)
      return res
        .status(401)
        .json({ stautsCode: 401, message: authConstant.UNAUTHORIZED });

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
        .json({ stautsCode: 401, message: authConstant.UNAUTHORIZED });

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

const verifyRoleToken = (role = []) => {
  return async (req, res, next) => {
    try {
      let token = req.header("Authorization");

      if (!token)
        return res
          .status(401)
          .json({ stautsCode: 401, message: authConstant.UNAUTHORIZED });

      if (token.startsWith("Bearer "))
        token = token.slice(7, token.length).trimLeft();

      const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);

      if (!role.includes(payload.role.id))
        return res
          .status(403)
          .json({ stautsCode: 403, message: authConstant.FORBIDDEN });

      req.user = payload;
      req.refreshToken = token;
      next();
    } catch (err) {
      res.status(401).json({ stautsCode: 401, message: err.message });
    }
  };
};

const verifyAdminOrHigherToken = verifyRoleToken([1]);

const verifyModeratorOrHigherToken = verifyRoleToken([1, 2]);

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

export {
  verifyAccessToken,
  verifyRefreshToken,
  verifyLoggedIn,
  verifyAdminOrHigherToken,
  verifyModeratorOrHigherToken,
};
