// ** Express
import express from "express";

// ** Middleware
import { verifyAccessToken } from "../middleware/jwt";
import { body } from "express-validator";

// ** Controllers
import { ClassController } from "../controller";

// ** Constants
import { classConstant } from "../constant/Class.constant";

const classRouter = express.Router();

classRouter.post(
  "/",
  verifyAccessToken,
  body("name")
    .trim()
    .notEmpty()
    .withMessage(classConstant.CLASSNAME_REQUIRED)
    .isLength({ max: 100 })
    .withMessage(classConstant.CLASSNAME_MAX),
  body("description").optional().trim(),
  ClassController.createClass
);

classRouter.get("/", verifyAccessToken, ClassController.getClassOfUser);

export default classRouter;
