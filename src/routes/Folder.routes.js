// ** Express
import express from 'express';

// ** Controllers
import { FolderController } from '../controller';

// ** Jwt
import { verifyAccessToken, verifyLoggedIn } from "../middleware/jwt";

// ** Validator
import { body, param, query } from "express-validator";

// ** Constants
import { commonConstant, userConstant } from "../constant";

const folderRouter = express.Router();

folderRouter.post('/create',verifyAccessToken, FolderController.createFolder);

folderRouter.get('/getAll', verifyAccessToken, FolderController.getAllFolder );

folderRouter.delete('/', verifyAccessToken, FolderController.deleteFolder )

export default folderRouter;
