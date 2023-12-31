import { folderService } from "../services";
import { response } from "../utils/baseResponse";
import { validation } from "../utils/validation";
import { authConstant, folderConstrant, httpConstant, studySetConstant } from "../constant";

export const FolderController = {
  createFolder: async (req, res) => {
    const error = validation.validationRequest(req, res);

    if (error) return res.status(200).json(error);

    const data = req.body;
    const { id } = req.user;

    try {
      const folderCreated = await folderService.createFolder(id, data);

      res.status(200).json(
        response.success({
          data: {
            folder: folderCreated,
          },
        })
      );
    } catch (err) {
      const errMessage = err?.message;
      console.log(errMessage);
      res.status(200).json(
        response.error({
          code: 500,
          message: httpConstant.SERVER_ERROR,
        })
      );
    }
  },
  addStudySetToFolder: async (req, res) => {
    try {
      const { id } = req.user;
      const { studySetId, folderId } = req.body;
      const addStudySetToFolder = await folderService.addStudySetToFolder(folderId, studySetId, id);
      res.status(200).json({
        message: 'Add study set to folder Successfully',
        addStudySetToFolder,
      });
    } catch (error) {
      res.status(500).json({ message: error.toString() });
    }
  },
  deleteStudySetFromFolder: async (req, res) => {
      const { id } = req.user;
      const {folderId, studySetId } = req.query;
      try {
        const studySetDeleted = await folderService.deleteStudySetFromFolder(folderId, studySetId, id);
        res.status(200).json(
          response.success({
            data: {
              studySetDeleted,
            },
          })
        )
      } catch (error) {
        res.status(500).json({ message: error.toString() });
      }
    
  },
  getStudySetByFolderId: async (req, res) =>{
      const {id} = req.user;
      const {folderId} = req.query;
      console.log("fdid", folderId);
      try {
        const studySets = await folderService.getStudySetByFolderId(folderId, id);
        res.status(200).json(
          response.success({
            data:{
              studySets
            },
          })
        )
      } catch (error) {
        res.status(500).json({ message: error.toString() });
      }
  },
  getAllFolder: async (req, res) => {
    try {
      const { limit, offset, search } = req.query;
      const { id } = req.user
      const allFolder = await folderService.getAllFolder(id, limit, offset, search);

      res.status(200).json({
        message: 'Get folder Successfully',
        allFolder,
      });
    } catch (error) {
      res.status(500).json({ message: error.toString() });
    }
  }
  ,
  deleteFolder: async (req, res) => {
    const error = validation.validationRequest(req, res);

    if (error) return res.status(200).json(error);

    const folderId = req.query.id;
    const { id } = req.user;

    try {
      const folderDeleted = await folderService.deleteFolder(id, folderId);

      res.status(200).json(
        response.success({
          data: {
            folder: folderDeleted,
          },
        })
      );
    } catch (err) {
      const errMessage = err?.message;
      const code =
        errMessage === folderConstrant.FOLDER_NOT_FOUND
          ? 404
          : errMessage === authConstant.FORBIDDEN
            ? 403
            : 500;

      res.status(200).json(
        response.error({
          code,
          message: code === 500 ? httpConstant.SERVER_ERROR : errMessage,
        })
      );
    }
  },
  updateFolderbyFolderId: async (req, res) => {
    const error = validation.validationRequest(req, res);
    if (error) {
      return res.status(200).json(error);
    }
    const data = req.body;
    const { id } = req.user;
    try {
      const folderUpdated = await folderService.updateFolderbyFolderId(id, data);
      res.status(200).json(
        response.success({
          data: {
            folder: folderUpdated,
          },
        })
      );
    } catch (err) {
      const errMessage = err?.message;
      const code =
        errMessage === folderConstrant.FOLDER_NOT_FOUND ? 404 : errMessage === authConstant.FORBIDDEN ? 403 : 500;
      res.status(200).json(
        response.error({
          code,
          message: errMessage
        })
      )
    }
  }

};
