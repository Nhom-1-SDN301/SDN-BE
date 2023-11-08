// ** Services
import { classService, testService } from "../services";

// ** Utils
import { response } from "../utils/baseResponse";

// ** Constants
import { authConstant } from "../constant";
import { validation } from "../utils/validation";
import { classConstant } from "../constant/Class.constant";

export const ClassController = {
  createClass: async (req, res) => {
    const error = validation.validationRequest(req, res);

    if (error) return res.status(200).json(error);

    const { name, description } = req.body;
    const user = req.user;

    try {
      const resp = await classService.createClass({ name, description, user });

      res.status(200).json(
        response.success({
          data: {
            class: resp,
          },
        })
      );
    } catch (err) {
      const errMessage = err?.message;
      const code =
        (errMessage === errMessage) === authConstant.FORBIDDEN ? 403 : 500;

      res.status(200).json(
        response.error({
          code,
          message: errMessage,
        })
      );
    }
  },
  getClassOfUser: async (req, res) => {
    const error = validation.validationRequest(req, res);

    if (error) return res.status(200).json(error);

    const user = req.user;

    try {
      const classes = await classService.getClassOfUser({ userId: user.id });

      res.status(200).json(
        response.success({
          data: {
            classes,
          },
        })
      );
    } catch (err) {
      const errMessage = err?.message;
      const code = errMessage === authConstant.FORBIDDEN ? 403 : 500;

      res.status(200).json(
        response.error({
          code,
          message: errMessage,
        })
      );
    }
  },
  updateClass: async (req, res) => {
    const error = validation.validationRequest(req, res);

    if (error) return res.status(200).json(error);

    const { id } = req.params;
    const { name, description } = req.body;
    const file = req.file;
    const user = req.user;

    try {
      const klass = await classService.updateClass({
        id,
        description,
        name,
        picture: file
          ? `${process.env.SERVER_URL}/images/${file.filename}`
          : null,
        userId: user.id,
      });

      res.status(200).json(
        response.success({
          data: {
            class: klass,
          },
        })
      );
    } catch (err) {
      const errMessage = err?.message;
      const code =
        errMessage === authConstant.FORBIDDEN
          ? 403
          : errMessage === classConstant.CLASS_NOT_FOUND
          ? 404
          : 500;

      res.status(200).json(
        response.error({
          code,
          message: errMessage,
        })
      );
    }
  },
  joinClassWithCode: async (req, res) => {
    const error = validation.validationRequest(req, res);

    if (error) return res.status(200).json(error);

    const { code } = req.body;
    const user = req.user;

    try {
      const klass = await classService.joinClassWithCode({
        userId: user.id,
        code,
      });

      res.status(200).json(
        response.success({
          data: {
            class: klass,
          },
        })
      );
    } catch (err) {
      const errMessage = err?.message;
      const code =
        errMessage === classConstant.USER_ALREADY_IN_CLASS
          ? 405
          : errMessage === classConstant.CLASS_NOT_FOUND
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
  getClassById: async (req, res) => {
    const error = validation.validationRequest(req, res);

    if (error) return res.status(200).json(error);

    const { id } = req.params;
    const user = req.user;

    try {
      const klass = await classService.getClassById({
        classId: id,
        userId: user.id,
      });

      res.status(200).json(
        response.success({
          data: {
            class: klass,
          },
        })
      );
    } catch (err) {
      const errMessage = err?.message;
      const code =
        errMessage === classConstant.CLASS_NOT_FOUND
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
  resetInviteCode: async (req, res) => {
    const error = validation.validationRequest(req, res);

    if (error) return res.status(200).json(error);

    const { id } = req.params;
    const user = req.user;

    try {
      const klass = await classService.resetInviteCode({
        classId: id,
        userId: user.id,
      });

      res.status(200).json(
        response.success({
          data: {
            class: klass,
          },
        })
      );
    } catch (err) {
      const errMessage = err?.message;
      const code =
        errMessage === classConstant.CLASS_NOT_FOUND
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
  turnOffInviteCode: async (req, res) => {
    const error = validation.validationRequest(req, res);

    if (error) return res.status(200).json(error);

    const { id } = req.params;
    const user = req.user;

    try {
      const klass = await classService.turnOffInviteCode({
        classId: id,
        userId: user.id,
      });

      res.status(200).json(
        response.success({
          data: {
            class: klass,
          },
        })
      );
    } catch (err) {
      const errMessage = err?.message;
      const code =
        errMessage === classConstant.CLASS_NOT_FOUND
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
  getMembersInClass: async (req, res) => {
    const error = validation.validationRequest(req, res);

    if (error) return res.status(200).json(error);

    const { classId } = req.params;
    const { search } = req.query;
    const user = req.user;

    try {
      const members = await classService.getMembersInClass({
        classId,
        userId: user.id,
        search,
      });

      res.status(200).json(
        response.success({
          data: {
            members,
          },
        })
      );
    } catch (err) {
      const errMessage = err?.message;
      const code =
        errMessage === classConstant.CLASS_NOT_FOUND
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
  updateMember: async (req, res) => {
    const error = validation.validationRequest(req, res);

    if (error) return res.status(200).json(error);

    const { classId, memberId } = req.params;
    const { canComment, canPost, canDoTest, canCreateTest } = req.body;
    const user = req.user;

    try {
      const isSuccess = await classService.updateMember({
        canComment,
        canCreateTest,
        canDoTest,
        canPost,
        classId,
        memberId,
        userId: user.id,
      });

      res.status(200).json(
        response.success({
          isSuccess,
        })
      );
    } catch (err) {
      const errMessage = err?.message;
      const code =
        errMessage === classConstant.MEMBER_NOT_EXIST_CLASS ||
        errMessage === classConstant.CLASS_NOT_FOUND
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
  removeMembersFromClass: async (req, res) => {
    const error = validation.validationRequest(req, res);

    if (error) return res.status(200).json(error);

    const { classId } = req.params;
    const { members } = req.body;
    const user = req.user;

    try {
      const isSuccess = await classService.removeMembersFromClass({
        classId,
        userId: user.id,
        members,
      });

      res.status(200).json(
        response.success({
          isSuccess,
        })
      );
    } catch (err) {
      const errMessage = err?.message;
      const code =
        errMessage === classConstant.CLASS_NOT_FOUND
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
  sendMailMembers: async (req, res) => {
    const error = validation.validationRequest(req, res);

    if (error) return res.status(200).json(error);

    const { subject, message, members } = req.body;
    const user = req.user;

    try {
      const isSuccess = await classService.sendMailToMembers({
        message,
        subject,
        user,
        members,
      });

      res.status(200).json(
        response.success({
          isSuccess,
        })
      );
    } catch (err) {
      const errMessage = err?.message;
      const code =
        errMessage === classConstant.CLASS_NOT_FOUND
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
  createTest: async (req, res) => {
    const error = validation.validationRequest(req, res);

    if (error) return res.status(200).json(error);

    const { classId } = req.params;
    const {
      title,
      description,
      limitTimesDoTest,
      time,
      startAt,
      endAt,
      subject,
    } = req.body;
    const user = req.user;

    try {
      const test = await testService.createTest({
        classId,
        description,
        endAt,
        subject,
        limitTimesDoTest,
        startAt,
        time,
        title,
        userId: user.id,
      });

      res.status(200).json(
        response.success({
          data: {
            test,
          },
        })
      );
    } catch (err) {
      const errMessage = err?.message;
      const code =
        errMessage === classConstant.CLASS_NOT_FOUND
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
  getTestsInClass: async (req, res) => {
    const error = validation.validationRequest(req, res);

    if (error) return res.status(200).json(error);

    const { classId } = req.params;
    const user = req.user;

    try {
      const tests = await testService.getTestsInClass({
        classId,
        userId: user.id,
      });

      res.status(200).json(
        response.success({
          data: {
            tests,
          },
        })
      );
    } catch (err) {
      const errMessage = err?.message;
      const code =
        errMessage === classConstant.CLASS_NOT_FOUND
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
  getTestsInClassByManager: async (req, res) => {
    const error = validation.validationRequest(req, res);

    if (error) return res.status(200).json(error);

    const { classId } = req.params;
    const user = req.user;

    try {
      const tests = await testService.getAllTestsInClass({
        classId,
        userId: user.id,
      });

      res.status(200).json(
        response.success({
          data: {
            tests,
          },
        })
      );
    } catch (err) {
      const errMessage = err?.message;
      const code =
        errMessage === classConstant.CLASS_NOT_FOUND
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
  getTestById: async (req, res) => {
    const error = validation.validationRequest(req, res);

    if (error) return res.status(200).json(error);

    const { classId, testId } = req.params;
    const user = req.user;

    try {
      const test = await testService.getTestById({
        classId,
        testId,
        userId: user.id,
      });

      res.status(200).json(
        response.success({
          data: {
            test,
          },
        })
      );
    } catch (err) {
      const errMessage = err?.message;
      const code =
        errMessage === classConstant.CLASS_NOT_FOUND ||
        errMessage === classConstant.TEST_NOT_FOUND
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
  deleteTestInClass: async (req, res) => {
    const error = validation.validationRequest(req, res);
    if (error) return res.status(200).json(error);

    const { classId, testId } = req.params;
    const user = req.user;

    try {
      const isSuccess = await testService.removeTest({
        classId,
        testId,
        userId: user.id,
      });

      res.status(200).json(
        response.success({
          isSuccess,
        })
      );
    } catch (err) {
      const errMessage = err?.message;
      const code =
        errMessage === classConstant.CLASS_NOT_FOUND ||
        errMessage === classConstant.TEST_NOT_FOUND
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
  unenroll: async (req, res) => {
    const error = validation.validationRequest(req, res);
    if (error) return res.status(200).json(error);

    const { classId } = req.params;
    const user = req.user;

    try {
      const isSuccess = await testService.unenroll({
        classId,
        userId: user.id,
      });

      res.status(200).json(
        response.success({
          isSuccess,
        })
      );
    } catch (err) {
      const errMessage = err?.message;
      const code =
        errMessage === classConstant.CLASS_NOT_FOUND ||
        errMessage === classConstant.TEST_NOT_FOUND
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
  }
};
