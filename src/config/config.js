import express from "express";
import dotenv from "dotenv";
import path from "path";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";
import multer from "multer";

export const config = (app) => {
  dotenv.config();

  app.use(express.static(path.join("./src", "assets")));
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(
    cors({
      origin: "http://localhost:3000",
      methods: "GET,POST,PUT,DELETE,PATCH",
      credentials: true,
    })
  );
  app.use(morgan("dev"));

  //limit json req
  app.use(bodyParser.json({ limit: "30mb", extended: true }));
  app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
};

