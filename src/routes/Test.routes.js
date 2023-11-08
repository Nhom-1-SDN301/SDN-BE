// ** Express
import express from "express";
import { body, param } from "express-validator";

// ** Controllers
import { TestController } from "../controller/Test.controller";

// ** Middleware
import { verifyAccessToken } from "../middleware/jwt";
import { classConstant } from "../constant/Class.constant";

import { uploadFiles, uploadImage } from "../config/multer";

const testRouter = express.Router();

testRouter.get(
  "/:testId",
  verifyAccessToken,
  param("testId").notEmpty().withMessage(classConstant.TEST_ID_REQUIRED),
  TestController.getTestToDoById
);

testRouter.patch(
  "/:testId",
  verifyAccessToken,
  param("testId").notEmpty().withMessage(classConstant.TEST_ID_REQUIRED),
  uploadFiles.single("picture"),
  body("content").optional(),
  body("type").notEmpty().withMessage("Type is required"),
  body("answers").notEmpty().withMessage("Answers is required"),
  TestController.addQuestion
);

testRouter.post(
  "/:testId/questions",
  verifyAccessToken,
  param("testId").notEmpty().withMessage(classConstant.TEST_ID_REQUIRED),
  uploadFiles.single("file"),
  TestController.addQuestionsExcel
);

testRouter.put(
  "/:testId",
  verifyAccessToken,
  param("testId").notEmpty().withMessage(classConstant.TEST_ID_REQUIRED),
  body("title").trim().notEmpty().withMessage(classConstant.TITLE_REQUIRED),
  body("description").trim().optional(),
  body("limitTimesDoTest")
    .notEmpty()
    .withMessage(classConstant.LIMIT_TIMES_DO_TEST_REQUIRED),
  body("time")
    .notEmpty()
    .isInt()
    .withMessage(classConstant.TIME_INVALID)
    .notEmpty()
    .withMessage(classConstant.TIME_REQUIRED),
  body("endAt").notEmpty().withMessage(classConstant.END_AT_REQUIRED),
  body("isActive").optional(),
  TestController.updateTest
);

testRouter.get(
  "/:testId/questions",
  verifyAccessToken,
  TestController.getQuestionsInTest
);

testRouter.patch(
  "/:testId/questions/:questionId",
  verifyAccessToken,
  param("testId").notEmpty().withMessage(classConstant.TEST_ID_REQUIRED),
  param("questionId")
    .notEmpty()
    .withMessage(classConstant.QUESTION_ID_REQUIRED),
  uploadFiles.single("picture"),
  body("content").optional(),
  body("type").notEmpty().withMessage("Type is required"),
  body("answers").notEmpty().withMessage("Answers is required"),
  TestController.updateQuestion
);

testRouter.delete(
  "/:testId/questions/:questionId",
  verifyAccessToken,
  param("testId").notEmpty().withMessage(classConstant.TEST_ID_REQUIRED),
  param("questionId")
    .notEmpty()
    .withMessage(classConstant.QUESTION_ID_REQUIRED),
  TestController.deleteQuestion
);

testRouter.post(
  "/:testId/submit",
  verifyAccessToken,
  param("testId").notEmpty().withMessage(classConstant.TEST_ID_REQUIRED),
  body("userChoices")
    .notEmpty()
    .withMessage(classConstant.USER_CHOICES_REQUIRED),
  body("doTime")
    .notEmpty()
    .withMessage(classConstant.DO_TIME_REQUIRED)
    .isInt()
    .withMessage(classConstant.DO_TIME_IS_NUMBER),
  TestController.submitTest
);

testRouter.get(
  "/:testId/history",
  verifyAccessToken,
  param("testId").notEmpty().withMessage(classConstant.TEST_ID_REQUIRED),
  TestController.getTestHistory
);

testRouter.get(
  "/:testId/history/teacher",
  verifyAccessToken,
  param("testId").notEmpty().withMessage(classConstant.TEST_ID_REQUIRED),
  TestController.getAllTestHistoryOfTest
)

export default testRouter;
