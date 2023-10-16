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
};

export { studySetReportService };
