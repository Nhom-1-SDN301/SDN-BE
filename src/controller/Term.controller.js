// ** Service
import { termService } from "../services";

// ** Validation
import { validation } from "../utils/validation";

// ** Constants
import { authConstant, httpConstant, studySetConstant, termConstant } from "../constant";

// ** Utils
import { response } from "../utils/baseResponse";

export const TermController = {
  createTerm: async (req, res) => {
    const error = validation.validationRequest(req, res);

    if (error) return res.status(200).json(error);

    const image = req.file;
    const { studySetId, ...dataBody } = req.body;
    const user = req.user;

    const dataTerm = {
      ...dataBody,
      picture: image?.filename,
    };

    try {
      const termCreated = await termService.create(
        user.id,
        studySetId,
        dataTerm
      );

      res.status(200).json(
        response.success({
          data: {
            term: termCreated,
          },
        })
      );
    } catch (err) {
      const errMessage = err?.message;
      const code =
        errMessage === studySetConstant.STUDYSET_NOT_FOUND
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
  getTermOfStudySet: async (req, res) => {
    const error = validation.validationRequest(req, res);

    if (error) return res.status(200).json(error);

    const studySetId = req.query.studySetId;
    const password = req.query.password;
    const id = req.user?.id;

    try {
      const data = await termService.get(id, studySetId, password);

      res.status(200).json(
        response.success({
          data: {
            terms: data,
          },
        })
      );
    } catch (err) {
      const errMessage = err?.message;
      const code =
        errMessage === studySetConstant.STUDYSET_NOT_FOUND
          ? 404
          : errMessage === authConstant.FORBIDDEN
          ? 403
          : errMessage === studySetConstant.VISIT_PASSWORD_INVALID
          ? 401
          : 500;
      res.status(200).json(
        response.error({
          code,
          message: code === 500 ? httpConstant.SERVER_ERROR : errMessage,
        })
      );
    }
  },
  updateTerm: async (req, res) => {
    const error = validation.validationRequest(req, res);

    if (error) return res.status(200).json(error);

    const image = req.file;
    const body = req.body;
    const user = req.user;

    const dataTerm = {
      ...body,
      picture: image?.filename,
    };

    try {
      const data = await termService.update(dataTerm, user.id);

      res.status(200).json(
        response.success({
          data: {
            term: data,
          },
        })
      );
    } catch (err) {
      const errMessage = err?.message;
      const code =
        errMessage === termConstant.TERM_NOTFOUND
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
  deleteTerm: async (req, res) => {
    const error = validation.validationRequest(req, res);

    if (error) return res.status(200).json(error);

    const { id } = req.params;
    const user = req.user;

    try {
      const data = await termService.delete(id, user.id);

      res.status(200).json(
        response.success({
          data: {
            term: data,
          },
        })
      );
    } catch (err) {
      const errMessage = err?.message;
      console.log(errMessage);
      const code =
        errMessage === termConstant.TERM_NOTFOUND
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
  }
};
