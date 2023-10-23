// ** Express
import express from "express";

// ** middlewares
import {
  verifyAccessToken,
  verifyAdminOrHigherToken,
  verifyModeratorOrHigherToken,
} from "../middleware/jwt";
import { body, param, query } from "express-validator";

// ** Controllers
import { StudySetReportController } from "../controller/StudySetReport.controller";

// ** Constants
import { studySetConstant } from "../constant";

const studySetReportRouter = express.Router();

studySetReportRouter.post(
  "/",
  verifyAccessToken,
  body("studySetId")
    .trim()
    .notEmpty()
    .withMessage(studySetConstant.ID_REQUIRED),
  body("description").trim().optional(),
  body("types").isArray({ min: 1 }),
  StudySetReportController.createReport
);

studySetReportRouter.get(
  "/",
  verifyModeratorOrHigherToken,
  query("status")
    .isInt({ min: 0, max: 2 })
    .withMessage(studySetConstant.STATUS_REPORT_RANGE)
    .optional(),
  StudySetReportController.getReport
);

studySetReportRouter.patch(
  "/:id",
  verifyModeratorOrHigherToken,
  param("id")
    .trim()
    .notEmpty()
    .withMessage(studySetConstant.ID_REPORT_REQUIRED),
  body("status")
    .notEmpty()
    .withMessage(studySetConstant.STATUS_REPORT_REQUIRED)
    .isInt({ min: 0, max: 2 })
    .withMessage(studySetConstant.STATUS_REPORT_RANGE),
  body("comment").optional(),
  StudySetReportController.updateStatus
);

export default studySetReportRouter;
