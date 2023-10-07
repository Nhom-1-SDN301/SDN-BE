// ** Models
import Term from "../models/Term";

// ** Services
import { studySetService } from "./StudySet.service";

// ** Constants
import { studySetConstant, authConstant, termConstant } from "../constant";

export const termService = {
  create: async (userId, studySetId, dataTerm) => {
    const studySet = await studySetService.findById(studySetId);

    if (!studySet) throw new Error(studySetConstant.STUDYSET_NOT_FOUND);
    if (!studySet.userId.equals(userId))
      throw new Error(authConstant.FORBIDDEN);

    const termCreated = new Term(dataTerm);
    termCreated.studySetId = studySetId;

    await termCreated.save();

    return termCreated;
  },
  update: async (dataTerm, userId) => {
    const term = await Term.findById(dataTerm.id);
    if (!term) throw new Error(termConstant.TERM_NOTFOUND);

    const studySet = await studySetService.findById(term.studySetId);
    if (!studySet?.userId.equals(userId))
      throw new Error(authConstant.FORBIDDEN);

    term.name = dataTerm.name;
    term.definition = dataTerm.definition;
    term.picture = dataTerm.picture || dataTerm.currentPicture || null;

    await term.save();

    return term;
  },
  get: async (userId, studySetId, password) => {
    const studySet = await studySetService.findById(studySetId);

    if (!studySet) throw new Error(studySetConstant.STUDYSET_NOT_FOUND);
    if (studySet.canVisit === 3 && !studySet.userId.equals(userId))
      throw new Error(authConstant.FORBIDDEN);
    if (
      studySet.canVisit === 2 &&
      !studySet.userId.equals(userId) &&
      studySet.visitPassword !== password
    )
      throw new Error(studySetConstant.VISIT_PASSWORD_INVALID);

    const terms = await Term.find({
      studySetId,
    });

    return terms;
  },
};
