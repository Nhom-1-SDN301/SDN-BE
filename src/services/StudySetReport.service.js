// ** Models
import StudySetReport from "../models/StudySetReport";
import StudySet from "../models/StudySet";

// ** Constants
import { authConstant, studySetConstant } from "../constant";

const studySetReportService = {
  createReport: async ({
    description = null,
    types = [],
    studySetId,
    userId,
  }) => {
    const studySet = await StudySet.findById(studySetId);
    if (!studySet) throw new Error(studySetConstant.STUDYSET_NOT_FOUND);

    if (studySet.userId.equals(userId)) throw new Error(authConstant.FORBIDDEN);

    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const studySetReports = await StudySetReport.find({
      userId,
      studySetId,
      createdAt: { $gte: threeDaysAgo },
    });

    if (studySetReports.length >= 3)
      throw new Error(studySetConstant.LIMIT_REPORT);

    const studySetReport = new StudySetReport({
      userId,
      studySetId,
      description,
      types,
    });

    await studySetReport.save();
    return studySetReport;
  },
  get: async ({ status }) => {
    const data = await StudySetReport.find({
      status,
    })
      .populate({
        path: "userId",
        select: "_id fullName email picture",
      })
      .populate({
        path: "studySetId",
        select: "_id title",
      })
      .exec();

    const reports = data.map((rp) => {
      const json = rp.toJSON();

      json.user = json.userId;
      json.studySet = json.studySetId;

      delete json.userId;
      delete json.studySetId;
      return json;
    });

    return reports;
  },
  updateReport: async ({ userId, id, status, comment }) => {
    const report = await StudySetReport.findById(id);

    if (!report) throw new Error(studySetConstant.REPORT_NOT_FOUND);

    report.comment = {
      content: comment,
      userId,
    };
    report.status = status;

    return await report.save();
  },
};

export { studySetReportService };
