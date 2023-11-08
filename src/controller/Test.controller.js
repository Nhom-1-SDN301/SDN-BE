// ** Services
import { testService } from "../services";

// ** Utils
import { response } from "../utils/baseResponse";

// ** Constants
import { authConstant } from "../constant";
import { validation } from "../utils/validation";
import { classConstant } from "../constant/Class.constant";

// ** Libs
import xlsx from "xlsx";

export const TestController = {
  getTestToDoById: async (req, res) => {
    const error = validation.validationRequest(req, res);
    if (error) return res.status(200).json(error);

    const { testId } = req.params;
    const user = req.user;

    try {
      const test = await testService.getTestToDo({ testId, userId: user.id });

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
          : errMessage === authConstant.FORBIDDEN ||
            errMessage === classConstant.LIMIT_TIME_DO_TEST
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
  addQuestion: async (req, res) => {
    const error = validation.validationRequest(req, res);
    if (error) return res.status(200).json(error);

    const { testId } = req.params;
    const user = req.user;
    const { content, type, answers } = req.body;
    const file = req.file;

    const answersParse = JSON.parse(answers);
    try {
      const question = await testService.addQuestion({
        answers: answersParse,
        content: content || null,
        picture: file
          ? `${process.env.SERVER_URL}/images/${file.filename}`
          : null,
        testId,
        type,
        userId: user.id,
      });

      res.status(200).json(
        response.success({
          data: {
            question,
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
  addQuestionsExcel: async (req, res) => {
    const error = validation.validationRequest(req, res);
    if (error) return res.status(200).json(error);

    const file = req.file;
    const { testId } = req.params;
    const user = req.user;

    try {
      const workbook = xlsx.readFile(file.path);
      const sheetName = workbook.SheetNames[0];
      const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

      const test = await testService.addQuestionsExcel({ data, user, testId });

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
  getQuestionsInTest: async (req, res) => {
    const error = validation.validationRequest(req, res);
    if (error) return res.status(200).json(error);

    const { testId } = req.params;
    const user = req.user;

    try {
      const questions = await testService.getQuestions({
        testId,
        userId: user.id,
      });

      res.status(200).json(
        response.success({
          data: {
            questions,
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
  deleteQuestion: async (req, res) => {
    const error = validation.validationRequest(req, res);
    if (error) return res.status(200).json(error);

    const { testId, questionId } = req.params;
    const user = req.user;

    try {
      const isSuccess = await testService.removeQuestion({
        testId,
        questionId,
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
  updateTest: async (req, res) => {
    const error = validation.validationRequest(req, res);
    if (error) return res.status(200).json(error);

    const { testId } = req.params;
    const { title, description, limitTimesDoTest, time, endAt, isActive } =
      req.body;
    const user = req.user;

    try {
      const test = await testService.updateTest({
        description,
        endAt,
        isActive,
        limitTimesDoTest,
        testId,
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
  submitTest: async (req, res) => {
    const error = validation.validationRequest(req, res);
    if (error) return res.status(200).json(error);

    const { testId } = req.params;
    const { userChoices, doTime } = req.body;
    const user = req.user;

    try {
      const submitTest = await testService.submitTest({
        testId,
        userId: user.id,
        userChoices,
        doTime,
      });

      res.status(200).json(
        response.success({
          data: {
            submitTest,
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
  getTestHistory: async (req, res) => {
    const error = validation.validationRequest(req, res);
    if (error) return res.status(200).json(error);

    const { testId } = req.params;
    const user = req.user;

    try {
      const testsHistory = await testService.getTestHistory({
        testId,
        userId: user.id,
      });

      res.status(200).json(
        response.success({
          data: {
            testsHistory,
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
  getAllTestHistoryOfTest: async (req, res) => {
    const error = validation.validationRequest(req, res);
    if (error) return res.status(200).json(error);

    const { testId } = req.params;
    const user = req.user;

    try {
      const testsHistory = await testService.getAllTestHistoryOfTest({
        testId,
        userId: user.id,
      });

      res.status(200).json(
        response.success({
          data: {
            testsHistory,
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
  updateQuestion: async (req, res) => {
    const error = validation.validationRequest(req, res);
    if (error) return res.status(200).json(error);

    const file = req.file;
    const { testId, questionId } = req.params;
    const { content, type, answers } = req.body;
    const user = req.user;

    const answersParse = JSON.parse(answers);

    try {
      const question = await testService.updateQuestion({
        answers: answersParse,
        content,
        picture: file?.filename || null,
        questionId,
        testId,
        type,
      });

      res.status(200).json(
        response.success({
          data: {
            question,
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
};
