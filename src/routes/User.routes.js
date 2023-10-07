// ** Express
import express from "express";

// ** Controllers
import { UserController } from "../controller";

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
userRouter.get("/", UserController.getAll);

export default userRouter;
