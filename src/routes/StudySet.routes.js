// ** Express
import express from "express";

// ** Controllers
import { StudySetController } from "../controller";

// ** Jwt
import { verifyAccessToken, verifyLoggedIn } from "../middleware/jwt";

// ** Validator
import { body, param, query } from "express-validator";

// ** Constants
import { commonConstant, studySetConstant, userConstant } from "../constant";

const studySetRouter = express.Router();

// studySetRouter.get("/", StudySetController.getAll);

studySetRouter.post(
  "/",
  verifyAccessToken,
  body("title")
    .trim()
    .notEmpty()
    .withMessage(studySetConstant.TITLE_REQUIRED)
    .isLength({ max: 255 }),
  body("description").trim().optional().isLength({ max: 500 }),
  body("canVisit")
    .notEmpty()
    .withMessage(studySetConstant.CAN_VISIT_REQUIRED)
    .isInt({ min: 1, max: 3 })
    .withMessage(studySetConstant.VISIT_PASSWORD_RANGE),
  body("visitPassword").optional(),
  StudySetController.createStudySet
);

studySetRouter.get("/getAll", verifyAccessToken, StudySetController.getAllStudySetByUserId)

studySetRouter.patch(
  "/",
  verifyAccessToken,
  body("title").trim().optional().isLength({ max: 255 }),
  body("description").trim().optional().isLength({ max: 500 }),
  body("canVisit")
    .optional()
    .isInt({ min: 1, max: 3 })
    .withMessage(studySetConstant.VISIT_PASSWORD_RANGE),
  body("visitPassword").optional(),
  StudySetController.updateStudySet
);

studySetRouter.delete(
  "/",
  verifyAccessToken,
  query("id").trim().notEmpty().withMessage(studySetConstant.ID_REQUIRED),
  StudySetController.deleteStudySet
);

studySetRouter.get(
  "/",
  verifyAccessToken,
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
  query("search").optional(),
  StudySetController.getStudySetByUserId
);

studySetRouter.get(
  "/shared",
  verifyAccessToken,
  StudySetController.getStudySetSharedToUser
)

studySetRouter.get(
  "/:id",
  verifyLoggedIn,
  param("id").notEmpty().withMessage(studySetConstant.ID_REQUIRED),
  StudySetController.getStudySetById
);

studySetRouter.put(
  "/:id/rate",
  verifyAccessToken,
  param("id").notEmpty().withMessage(studySetConstant.ID_REQUIRED),
  body("star")
    .notEmpty()
    .withMessage(studySetConstant.STAR_REQUIRED)
    .isInt({ min: 1, max: 5 })
    .withMessage(studySetConstant.STAR_RANGE),
  body("comment").optional(),
  StudySetController.createRatting
);

studySetRouter.get(
  "/:id/rate",
  param("id").notEmpty().withMessage(studySetConstant.ID_REQUIRED),
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
  StudySetController.getRatesOfStudySet
);

studySetRouter.get(
  "/:studySetId/rate/user/:userId",
  param("studySetId").notEmpty().withMessage(studySetConstant.ID_REQUIRED),
  param("userId").notEmpty().withMessage(userConstant.ID_REQUIRED),
  StudySetController.getRateStudySetOfUser
);

studySetRouter.post(
  "/:studySetId/share",
  verifyAccessToken,
  param("studySetId").notEmpty().withMessage(studySetConstant.ID_REQUIRED),
  StudySetController.shareStudySet
);

export default studySetRouter;
