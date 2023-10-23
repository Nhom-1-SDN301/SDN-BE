// ** Express
import express from "express";

// ** Controllers
import { UserController } from "../controller";

// ** Constants
import {
  authConstant,
  commonConstant,
  studySetConstant,
  userConstant,
} from "../constant";

// ** Validation
import { body, param, query } from "express-validator";
import { verifyAccessToken, verifyAdminOrHigherToken } from "../middleware/jwt";
import { uploadImage } from '../config/multer';

const userRouter = express.Router();

/**
 * @openapi
 * /user:
 *  get:
 *      description: get all user
 *      tags:
 *          - User
 *      requestBody:
 *          description: None
 */
userRouter.get(
  "/:email/study-set",
  verifyAccessToken,
  param("email").trim().notEmpty().withMessage(userConstant.EMAIL_REQUIRED),
  query("studySetId")
    .trim()
    .notEmpty()
    .withMessage(studySetConstant.ID_REQUIRED),
  UserController.getUsersByEmail
);

userRouter.get(
  "/admin",
  verifyAdminOrHigherToken,
  query("limit")
    .notEmpty()
    .withMessage(commonConstant.LIMIT_REQUIRED)
    .isInt({ min: 1 })
    .withMessage(commonConstant.LIMIT_MIN),
  query("offset")
    .notEmpty()
    .withMessage(commonConstant.OFFSET_REQUIRED)
    .isInt({ min: 0 })
    .withMessage(commonConstant.OFFSET_MIN),
  query("search")
    .optional()
    .isLength({ max: 255 })
    .withMessage(commonConstant.SEARCH_MAX_LENGTH),
  query("role")
    .optional()
    .isInt({ min: 1, max: 3 })
    .withMessage(userConstant.ROLE_RANGE),
  query("status")
    .optional()
    .isInt({ min: 0, max: 1 })
    .withMessage(userConstant.STATUS_RANGE),
  UserController.getUserByAdmin
);

userRouter.patch(
  "/admin/status/:userId",
  verifyAdminOrHigherToken,
  param("userId").trim().notEmpty().withMessage(userConstant.ID_REQUIRED),
  body("isDelete")
    .notEmpty()
    .withMessage(commonConstant.ISDELETE_REQUIRED)
    .isBoolean()
    .withMessage(commonConstant.ISDELETE_BOOLEAN),
  UserController.updateStatusUser
);

userRouter.patch(
  "/:id",
  verifyAccessToken,
  uploadImage.single("picture"),
  param("id").trim().notEmpty().withMessage(userConstant.ID_REQUIRED),
  body("fullName")
    .trim()
    .notEmpty()
    .withMessage(authConstant.FULLNAME_REQUIRED),
  body("dob")
    .optional()
    .isDate({ format: "dd/mm/yyyy" })
    .withMessage(userConstant.DATE_INVALID),
  body("phone").optional(),
  body("gender")
    .notEmpty()
    .withMessage(authConstant.GENDER_REQUIRED)
    .isInt({ min: 0, max: 1 })
    .withMessage(authConstant.GENDER_IN_RANGE),
  body("address").optional(),
  UserController.updateUser
);

export default userRouter;
