// ** Service
import { studySetReportService } from "../services";

// ** Validation
import { response } from "../utils/baseResponse";
import { validation } from "../utils/validation";

// ** Constants
import { authConstant, httpConstant, studySetConstant } from "../constant";

export const StudySetReportController = {
  createReport: async (req, res) => {
    const error = validation.validationRequest(req, res);

    if (error) return res.status(200).json(error);

    const user = req.user;
    const { studySetId, description, types } = req.body;

    try {
      const report = await studySetReportService.createReport({
        studySetId,
        description,
        types,
        userId: user.id,
      });

      res.status(200).json(
        response.success({
          data: {
            reportStudySet: report,
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
          : errMessage === studySetConstant.LIMIT_REPORT
          ? 405
          : 500;
      res.status(200).json(
        response.error({
          code: code,
          message: code === 500 ? httpConstant.SERVER_ERROR : errMessage,
        })
      );
    }
  },
};
