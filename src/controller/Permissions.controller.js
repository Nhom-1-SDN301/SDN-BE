// ** Service
import { permissionsService } from "../services/Permissions.service";

// ** Base Response
import { response } from "../utils/baseResponse";

// ** Constants
import { authConstant, httpConstant } from "../constant";
import  {permissionsConstrant} from "../constant/Permissions.constant";
// ** Validator
import { validation } from "../utils/validation";

export const PermissionsController = {
  createPermissions: async (req, res) => {
    const error = validation.validationRequest(req, res);

    if (error) return res.status(200).json(error);

    const data = req.body;
    const { id } = req.user;

    try {
      const permissionsCreated = await permissionsService.create(id, data);

      res.status(200).json(
        response.success({
          data: {
            permissions: permissionsCreated,
          },
        })
      );
    } catch (err) {
      const errMessage = err?.message;
      res.status(200).json(
        response.error({
          code: 500,
          message: httpConstant.SERVER_ERROR,
        })
      );
    }
  },

  deletePermissions: async (req, res) => {
    const error = validation.validationRequest(req, res);

    if (error) return res.status(200).json(error);

    const permissionsId = req.query.id;
    const { id } = req.user;

    try {
      const permissionsDeleted = await permissionsService.delete(id, permissionsId);

      res.status(200).json(
        response.success({
          data: {
            permissions: permissionsDeleted,
          },
        })
      );
    } catch (err) {
      const errMessage = err?.message;
      const code =
        errMessage === permissionsConstrant.PERMISSIONS_NOT_FOUND
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
 

getAllPermissions: async (req, res) => {
    try {
      const { limit, offset, search } = req.query; 
      const allPermissions = await permissionsService.getAllPermissions(limit, offset, search);
  
      res.status(200).json({
        message: 'Get folder Successfully',
        allPermissions,
      });
    } catch (error) {
      res.status(500).json({ message: error.toString() });
    }
  }
 
};
