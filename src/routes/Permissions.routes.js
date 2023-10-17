// ** Express
import express from 'express';

// ** Controllers
import { PermissionsController } from '../controller/Permissions.controller';

// ** Jwt
import { verifyAccessToken, verifyLoggedIn } from "../middleware/jwt";

// ** Validator


// ** Constants
import { commonConstant, userConstant } from "../constant";

const permissionsRouter = express.Router();

permissionsRouter.post('/create',verifyAccessToken, PermissionsController.createPermissions);

permissionsRouter.get('/getAll', verifyAccessToken, PermissionsController.getAllPermissions );

permissionsRouter.delete('/', verifyAccessToken, PermissionsController.deletePermissions )

export default permissionsRouter;
