import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";

export const config = (app) => {
  dotenv.config();

  app.use(express.static(path.join("./src", "assets")));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(
    cors({
      origin: "*",
      methods: "GET,POST,PUT,DELETE,PATCH",
      credentials: true,
    })
  );
  app.use(morgan("dev"));

  //limit json req
  app.use(
    bodyParser.json({ limit: "50mb", extended: true, parameterLimit: 1000000 })
  );
  app.use(
    bodyParser.urlencoded({
      limit: "50mb",
      extended: true,
      parameterLimit: 1000000,
    })
  );
  app.use(bodyParser.text({ limit: "200mb" }));
};
