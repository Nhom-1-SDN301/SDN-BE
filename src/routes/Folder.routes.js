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

folderRouter.patch("/", 
verifyAccessToken,
body("title").trim().optional().isLength({max: 255}),
body("description").trim().optional().isLength({max: 500}), FolderController.updateFolderbyFolderId)
export default folderRouter;
