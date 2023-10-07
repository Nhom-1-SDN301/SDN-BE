// ** Express
import express from "express";

// ** Controllers
import { AuthController } from "../controller";

// ** Constants
import { authConstant, userConstant } from "../constant";

// ** Middlewares
import { body } from "express-validator";
import { verifyRefreshToken } from "../middleware/jwt";

const authRouter = express.Router();

authRouter.post(
  "/register",
  body("email")
    .trim()
    .notEmpty()
    .withMessage(authConstant.EMAIL_REQUIRE)
    .isEmail()
    .withMessage(authConstant.EMAIL_INVALID),
  body("password")
    .trim()
    .notEmpty()
    .withMessage(authConstant.PASSWORD_REQUIRED)
    .isLength({ min: 6 })
    .withMessage(authConstant.PASSWORD_MIN_LENGTH),
  body("fullName")
    .trim()
    .notEmpty()
    .withMessage(authConstant.FULLNAME_REQUIRED),
  body("gender")
    .notEmpty()
    .withMessage(authConstant.GENDER_REQUIRED)
    .isInt({ min: 0, max: 1 })
    .withMessage(authConstant.GENDER_IN_RANGE),
  AuthController.register
);

authRouter.post(
  "/login",
  body("email")
    .trim()
    .notEmpty()
    .withMessage(authConstant.EMAIL_REQUIRE)
    .isEmail()
    .withMessage(authConstant.EMAIL_INVALID),
  body("password")
    .trim()
    .notEmpty()
    .withMessage(authConstant.PASSWORD_REQUIRED),
  AuthController.login
);

authRouter.get("/refresh-token", verifyRefreshToken, AuthController.refreshToken);

export default authRouter;
