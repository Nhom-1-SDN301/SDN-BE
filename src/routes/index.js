// ** Express
import express from "express";

// ** Router
import userRouter from "./User.routes";
import studySetRouter from "./StudySet.routes";
import termRouter from "./Term.routes";
import folderRouter from "./Folder.routes";
import authRouter from "./Auth.routes";
import classRouter from "./Class.routes";
import postRouter from "./Post.routes";
import testRouter from "./Test.routes";
import studySetReportRouter from "./StudySetReport.routes";
import permissionsRouter from "./Permissions.routes";
export const mainRouter = (app) => {
  const v1Router = express.Router();

  v1Router.use("/auth", authRouter);
  v1Router.use("/class", classRouter);
  v1Router.use("/folder", folderRouter);
  v1Router.use("/post", postRouter);
  v1Router.use("/study-set", studySetRouter);
  v1Router.use("/study-set-report", studySetReportRouter);
  v1Router.use("/user", userRouter);
  v1Router.use("/term", termRouter);
  v1Router.use("/test", testRouter);
  v1Router.use("/permissions", permissionsRouter);
  app.use("/api/v1", v1Router);
};
