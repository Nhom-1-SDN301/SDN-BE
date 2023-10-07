// ** Express
import express from 'express';

// ** Controllers
import { FolderController } from '../controller';

const folderRouter = express.Router();

folderRouter.get('/', FolderController.getAll);

export default folderRouter;
