// ** Express
import express from "express";

// ** middlewares
import { verifyAccessToken } from "../middleware/jwt";
import { body } from "express-validator";

// ** Controllers
import { StudySetReportController } from "../controller/StudySetReport.controller";
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

export default studySetReportRouter;
