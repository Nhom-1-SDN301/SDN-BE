// ** Express
import express from "express";

// ** Middleware
import { verifyAccessToken } from "../middleware/jwt";
import { body, param, query } from "express-validator";

// ** Controllers
import { ClassController, PostController } from "../controller";

// ** Constants
import { classConstant } from "../constant/Class.constant";
import { uploadFiles, uploadImage } from "../config/multer";
import { commonConstant } from "../constant";

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
classRouter.get(
  "/:id",
  verifyAccessToken,
  param("id").trim().notEmpty().withMessage(classConstant.ID_REQUIRED),
  ClassController.getClassById
);

classRouter.patch(
  "/:id",
  verifyAccessToken,
  param("id").trim().notEmpty().withMessage(classConstant.ID_REQUIRED),
  uploadFiles.single("picture"),
  body("name")
    .trim()
    .notEmpty()
    .withMessage(classConstant.CLASSNAME_REQUIRED)
    .isLength({ max: 100 })
    .withMessage(classConstant.CLASSNAME_MAX),
  body("description").optional().trim(),
  ClassController.updateClass
);

classRouter.patch(
  "/:id/reset-code",
  verifyAccessToken,
  param("id").trim().notEmpty().withMessage(classConstant.ID_REQUIRED),
  ClassController.resetInviteCode
);

classRouter.patch(
  "/:id/turnOff-code",
  verifyAccessToken,
  param("id").trim().notEmpty().withMessage(classConstant.ID_REQUIRED),
  ClassController.turnOffInviteCode
);

classRouter.post(
  "/join",
  verifyAccessToken,
  body("code").trim().notEmpty().withMessage(classConstant.CODE_REQUIRED),
  ClassController.joinClassWithCode
);

classRouter.post(
  "/:id/post",
  verifyAccessToken,
  uploadFiles.array("file"),
  // uploadImage.array("image"),
  param("id").trim().notEmpty().withMessage(classConstant.ID_REQUIRED),
  body("content").optional(),
  PostController.createPost
);

classRouter.get(
  "/:id/post",
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
  PostController.getPost
);

classRouter.delete(
  "/:classId/post/:postId",
  verifyAccessToken,
  param("classId").notEmpty().withMessage(classConstant.ID_REQUIRED),
  param("postId").notEmpty().withMessage(classConstant.POST_ID_REQUIRED),
  PostController.removePost
);

classRouter.post(
  "/:classId/post/:postId/comment",
  verifyAccessToken,
  uploadFiles.single("picture"),
  param("classId").notEmpty().withMessage(classConstant.ID_REQUIRED),
  param("postId").notEmpty().withMessage(classConstant.POST_ID_REQUIRED),
  body("content").optional(),
  body("replyToComment").optional(),
  body("replyUser").optional(),
  PostController.createComment
);

classRouter.delete(
  "/:classId/post/:postId/comment",
  verifyAccessToken,
  param("classId").notEmpty().withMessage(classConstant.ID_REQUIRED),
  param("postId").notEmpty().withMessage(classConstant.POST_ID_REQUIRED),
  body("mainCommentId")
    .notEmpty()
    .withMessage(classConstant.MAIN_COMMENT_ID_REQUIRED),
  body("subCommentId").optional(),
  PostController.removeComment
);

classRouter.patch(
  "/:classId/post/:postId/comment",
  verifyAccessToken,
  param("classId").notEmpty().withMessage(classConstant.ID_REQUIRED),
  param("postId").notEmpty().withMessage(classConstant.POST_ID_REQUIRED),
  body("mainCommentId")
    .notEmpty()
    .withMessage(classConstant.MAIN_COMMENT_ID_REQUIRED),
  body("subCommentId").optional(),
  body("content").trim().notEmpty().withMessage(classConstant.CONTENT_REQUIRED),
  PostController.updateComment
);

classRouter.get(
  "/:classId/post/:postId/comment",
  verifyAccessToken,
  param("classId").notEmpty().withMessage(classConstant.ID_REQUIRED),
  param("postId").notEmpty().withMessage(classConstant.POST_ID_REQUIRED),
  PostController.getCommentsOfPost
);

classRouter.get(
  "/:classId/members",
  verifyAccessToken,
  param("classId").notEmpty().withMessage(classConstant.ID_REQUIRED),
  query("search").optional(),
  ClassController.getMembersInClass
);

classRouter.delete(
  "/:classId/members",
  verifyAccessToken,
  param("classId").notEmpty().withMessage(classConstant.ID_REQUIRED),
  body("members")
    .notEmpty()
    .withMessage(classConstant.MEMBERS_REQUIRED)
    .isArray()
    .withMessage(classConstant.MEMBERS_MUST_ARRAY),
  ClassController.removeMembersFromClass
);

classRouter.patch(
  "/:classId/members/:memberId/permissions",
  verifyAccessToken,
  param("classId").notEmpty().withMessage(classConstant.ID_REQUIRED),
  param("memberId").notEmpty().withMessage(classConstant.MEMBER_ID_REQUIRED),
  body("canComment")
    .notEmpty()
    .isBoolean()
    .withMessage(commonConstant.BOOLEAN_ONLY),
  body("canPost")
    .notEmpty()
    .isBoolean()
    .withMessage(commonConstant.BOOLEAN_ONLY),
  body("canDoTest")
    .notEmpty()
    .isBoolean()
    .withMessage(commonConstant.BOOLEAN_ONLY),
  body("canCreateTest")
    .notEmpty()
    .isBoolean()
    .withMessage(commonConstant.BOOLEAN_ONLY),
  ClassController.updateMember
);

classRouter.post(
  "/:classId/members/sendMail",
  verifyAccessToken,
  body("subject").notEmpty().withMessage(classConstant.SUBJECT_REQUIRED),
  body("message").notEmpty().withMessage(classConstant.MESSAGE_REQUIRED),
  body("members")
    .notEmpty()
    .withMessage(classConstant.MEMBERS_REQUIRED)
    .isArray()
    .withMessage(classConstant.MEMBERS_MUST_ARRAY),
  ClassController.sendMailMembers
);

classRouter.post(
  "/:classId/test",
  verifyAccessToken,
  body("title").trim().notEmpty().withMessage(classConstant.TITLE_REQUIRED),
  body("description").optional().trim(),
  body("subject").notEmpty().withMessage(classConstant.SUBJECT_REQUIRED),
  body("limitTimesDoTest")
    .optional()
    .isInt()
    .withMessage(classConstant.LIMIT_TIMES_DO_TEST_REQUIRED),
  body("time").notEmpty().withMessage(classConstant.TIME_REQUIRED),
  body("startAt").notEmpty().withMessage(classConstant.START_AT_REQUIRED),
  body("endAt").notEmpty().withMessage(classConstant.END_AT_REQUIRED),
  ClassController.createTest
);

classRouter.get(
  "/:classId/test",
  verifyAccessToken,
  param("classId").notEmpty().withMessage(classConstant.ID_REQUIRED),
  ClassController.getTestsInClass
);

classRouter.delete(
  "/:classId/test/:testId",
  verifyAccessToken,
  param("classId").notEmpty().withMessage(classConstant.ID_REQUIRED),
  param("testId").notEmpty().withMessage(classConstant.TEST_ID_REQUIRED),
  ClassController.deleteTestInClass
);

classRouter.get(
  "/:classId/test/manager",
  verifyAccessToken,
  param("classId").notEmpty().withMessage(classConstant.ID_REQUIRED),
  ClassController.getTestsInClassByManager
);

classRouter.get(
  "/:classId/test/:testId",
  verifyAccessToken,
  param("classId").notEmpty().withMessage(classConstant.ID_REQUIRED),
  param("testId").notEmpty().withMessage(classConstant.TEST_ID_REQUIRED),
  ClassController.getTestById
);

classRouter.patch(
  "/:classId/unenroll",
  verifyAccessToken,
  param("classId").notEmpty().withMessage(classConstant.ID_REQUIRED),
  ClassController.unenroll
);

export default classRouter;
