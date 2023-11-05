// ** Service
import { studySetService } from "../services";

// ** Base Response
import { response } from "../utils/baseResponse";

// ** Constants
import { authConstant, httpConstant, studySetConstant } from "../constant";

// ** Validator
import { validation } from "../utils/validation";

export const StudySetController = {
  createStudySet: async (req, res) => {
    const error = validation.validationRequest(req, res);

    if (error) return res.status(200).json(error);

    const data = req.body;
    const { id } = req.user;

    try {
      const studySetCreated = await studySetService.create(id, data);

      res.status(200).json(
        response.success({
          data: {
            studySet: studySetCreated,
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
  updateStudySet: async (req, res) => {
    const error = validation.validationRequest(req, res);

    if (error) return res.status(200).json(error);

    const data = req.body;
    const { id } = req.user;

    try {
      const studySetUpdated = await studySetService.update(id, data);

      res.status(200).json(
        response.success({
          data: {
            studySet: studySetUpdated,
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
          message: errMessage,
        })
      );
    }
  },
  deleteStudySet: async (req, res) => {
    const error = validation.validationRequest(req, res);

    if (error) return res.status(200).json(error);

    const studySetId = req.query.id;
    const { id, role } = req.user;

    try {
      const studySetDeleted = await studySetService.delete(
        id,
        studySetId,
        role.id
      );

      res.status(200).json(
        response.success({
          data: {
            studySet: studySetDeleted,
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
  getStudySetByUserId: async (req, res) => {
    const error = validation.validationRequest(req, res);

    if (error) return res.status(200).json(error);

    const limit = req.query.limit;
    const offset = req.query.offset;
    const search = req.query.search;
    const { id } = req.user;

    try {
      const data = await studySetService.getAllByUserId(
        id,
        limit,
        offset,
        search
      );

      res.status(200).json(
        response.success({
          data,
        })
      );
    } catch (err) {
      const errMessage = err?.message;
      const code = errMessage === httpConstant.SERVER_ERROR ? 500 : 500;
      res.status(200).json(
        response.error({
          code,
          message: code === 500 ? httpConstant.SERVER_ERROR : errMessage,
        })
      );
    }
  },
  getAllStudySetByUserId: async (req, res) => {
    const error = validation.validationRequest(req, res);
    if (error) {
      return res.status(200).json(error);
    }
    const user = req.user;
    const {folder} = req.body
    try {
      const studySet = await studySetService.getAllStudySetByUserId(user);
      res.status(200).json(
        response.success({
          data: {
            studySet,
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
  getStudySetById: async (req, res) => {
    const error = validation.validationRequest(req, res);

    if (error) return res.status(200).json(error);

    const { id } = req.params;

    try {
      const studySet = await studySetService.getById(id);

      res.status(200).json(
        response.success({
          data: {
            studySet,
          },
        })
      );
    } catch (err) {
      const errMessage = err?.message;
      console.log(errMessage);
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
  createRatting: async (req, res) => {
    const error = validation.validationRequest(req, res);

    if (error) return res.status(200).json(error);

    const { id } = req.params;
    const user = req.user;
    const { star, comment } = req.body;

    try {
      const data = await studySetService.createRate(user.id, id, star, comment);

      res.status(200).json(
        response.success({
          data,
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
  getRatesOfStudySet: async (req, res) => {
    const error = validation.validationRequest(req, res);

    if (error) return res.status(200).json(error);

    const { id } = req.params;
    const { limit, offset } = req.query;

    try {
      const data = await studySetService.getRates(id, limit, offset);

      res.status(200).json(
        response.success({
          data,
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
  getRateStudySetOfUser: async (req, res) => {
    const error = validation.validationRequest(req, res);

    if (error) return res.status(200).json(error);

    const { studySetId, userId } = req.params;

    try {
      const rate = await studySetService.getRateStudySetOfUser(
        studySetId,
        userId
      );

      res.status(200).json(
        response.success({
          data: {
            rate,
          },
        })
      );
    } catch (err) {
      const errMessage = err?.message;
      const code = errMessage === httpConstant.SERVER_ERROR ? 500 : 500;
      res.status(200).json(
        response.error({
          code,
          message: code === 500 ? httpConstant.SERVER_ERROR : errMessage,
        })
      );
    }
  },
  shareStudySet: async (req, res) => {
    const error = validation.validationRequest(req, res);

    if (error) return res.status(200).json(error);

    const { studySetId } = req.params;
    const { users } = req.body;

    const user = req.user;

    try {
      await studySetService.shareStudySet({
        studySetId,
        users,
        userId: user.id,
      });

      res.status(200).json(
        response.success({
          data: {
            message: studySetConstant.SHARE_SUCCESS,
          },
        })
      );
    } catch (err) {
      const errMessage = err?.message;
      console.log(errMessage);
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
  getStudySetSharedToUser: async (req, res) => {
    const error = validation.validationRequest(req, res);

    if (error) return res.status(200).json(error);

    const user = req.user;

    try {
      const data = await studySetService.getSharedStudySet({ user });

      res.status(200).json(
        response.success({
          data: {
            studySets: data,
          },
        })
      );
    } catch (err) {
      const errMessage = err?.message;
      console.log(errMessage);
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
};
