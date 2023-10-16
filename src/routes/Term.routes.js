// ** Express
import express from "express";

// ** Controllers
import { TermController } from "../controller";

// ** Jwt
import { verifyAccessToken, verifyLoggedIn } from "../middleware/jwt";

// ** Validator
import { body, param, query } from "express-validator";

// ** Constants
import { termConstant, studySetConstant } from "../constant";

// ** Upload
import { uploadImage } from "../config/multer";

// ** Utils
import { validation } from "../utils/validation";

const termRouter = express.Router();

termRouter.post(
  "/",
  verifyAccessToken,
  uploadImage.single("picture"),
  body("name")
    .trim()
    .notEmpty()
    .withMessage(termConstant.NAME_REQUIRED)
    .isLength({ max: 255 }),
  body("definition")
    .trim()
    .notEmpty()
    .withMessage(termConstant.DEFINITION_REQUIRED)
    .isLength({ max: 255 }),
  body("studySetId")
    .trim()
    .notEmpty()
    .withMessage(studySetConstant.ID_REQUIRED),
  TermController.createTerm
);

termRouter.patch(
  "/",
  verifyAccessToken,
  uploadImage.single("picture"),
  body("id").trim().notEmpty().withMessage(termConstant.ID_REQUIRED),
  body("name")
    .trim()
    .notEmpty()
    .withMessage(termConstant.NAME_REQUIRED)
    .isLength({ max: 550 }),
  body("definition")
    .trim()
    .notEmpty()
    .withMessage(termConstant.DEFINITION_REQUIRED)
    .isLength({ max: 255 }),
  TermController.updateTerm
);

termRouter.get(
  "/",
  verifyLoggedIn,
  query("studySetId")
    .trim()
    .notEmpty()
    .withMessage(studySetConstant.STUDYSET_NOT_FOUND),
  query("password").optional().trim(),
  TermController.getTermOfStudySet
);

termRouter.delete(
  "/:id",
  verifyAccessToken,
  param("id").trim().notEmpty().withMessage(termConstant.ID_REQUIRED),
  TermController.deleteTerm
);

export default termRouter;
