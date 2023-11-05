// ** Models
import Klass from "../models/Class";
import Test from "../models/Test";
import TestHistory from "../models/TestHistory";

// ** Constants
import { classConstant } from "../constant/Class.constant";
import { authConstant } from "../constant";

export const testService = {
  createTest: async ({
    classId,
    userId,
    title,
    subject,
    description,
    limitTimesDoTest,
    time,
    startAt,
    endAt,
  }) => {
    const klass = await Klass.findById(classId);

    if (!klass) throw new Error(classConstant.CLASS_NOT_FOUND);

    const member = klass.members.find((member) => member.userId.equals(userId));
    if (!(klass.userId.equals(userId) || (member && member.canCreateTest)))
      throw new Error(authConstant.FORBIDDEN);

    const test = new Test({
      title,
      description,
      limitTimesDoTest,
      classId,
      subject,
      userId,
      time,
      startAt,
      endAt,
    });

    await test.save();

    return test;
  },
  getTestsInClass: async ({ classId, userId }) => {
    const klass = await Klass.findById(classId);

    if (!klass) throw new Error(classConstant.CLASS_NOT_FOUND);

    const member = klass.members.find((member) => member.userId.equals(userId));
    if (!(klass.userId.equals(userId) || member))
      throw new Error(authConstant.FORBIDDEN);

    const tests = await Test.find({
      classId,
      isActive: true,
      isDelete: false,
    })
      .sort({ _id: -1 })
      .populate({
        path: "userId",
        select: "_id fullName email dob gender role picture",
      })
      .exec();

    const testJson = tests.map((test) => {
      const json = test.toJSON();

      json["user"] = json.userId;
      delete json.userId;
      delete json.questions;

      return json;
    });

    return testJson;
  },
  getAllTestsInClass: async ({ classId, userId }) => {
    const klass = await Klass.findById(classId);

    if (!klass) throw new Error(classConstant.CLASS_NOT_FOUND);

    const member = klass.members.find((member) => member.userId.equals(userId));
    if (!(klass.userId.equals(userId) || (member && member.canCreateTest)))
      throw new Error(authConstant.FORBIDDEN);

    const tests = await Test.find({
      classId,
      isDelete: false,
    })
      .sort({ _id: -1 })
      .populate({
        path: "userId",
        select: "_id fullName email dob gender role picture",
      })
      .exec();

    const testJson = tests.map((test) => {
      const json = test.toJSON();

      json["user"] = json.userId;
      json["numberOfQuestion"] = json.questions.length;
      delete json.userId;
      delete json.questions;

      return json;
    });

    return testJson;
  },
  getTestById: async ({ classId, testId, userId }) => {
    const klass = await Klass.findById(classId);
    if (!klass) throw new Error(classConstant.CLASS_NOT_FOUND);

    const test = await Test.findById(testId).populate({
      path: "userId",
      select: "_id fullName email dob gender role picture",
    });
    if (!test) throw new Error(classConstant.TEST_NOT_FOUND);

    const member = klass.members.find((member) => member.userId.equals(userId));

    if (
      !(
        test.classId.equals(classId) &&
        (klass.userId.equals(userId) || (member && member.canDoTest))
      )
    )
      throw new Error(authConstant.FORBIDDEN);

    const json = test.toJSON();

    json["user"] = json.userId;
    json["numberOfQuestion"] = json.questions.length;

    delete json.userId;

    return json;
  },
  removeTest: async ({ classId, testId, userId }) => {
    const klass = await Klass.findById(classId);

    if (!klass) throw new Error(classConstant.CLASS_NOT_FOUND);

    const member = klass.members.find((member) => member.userId.equals(userId));
    if (!(klass.userId.equals(userId) || (member && member.canCreateTest)))
      throw new Error(authConstant.FORBIDDEN);

    const test = await Test.findById(testId);
    if (!test) throw new Error(classConstant.TEST_NOT_FOUND);

    test.isDelete = true;
    await test.save();

    return true;
  },
  addQuestion: async ({ content, picture, type, answers, testId, userId }) => {
    const test = await Test.findById(testId);
    if (!test) throw new Error(classConstant.TEST_NOT_FOUND);

    test.questions.push({
      content,
      picture,
      type,
      answers,
    });

    await test.save();

    return test;
  },
  getQuestions: async ({ testId, userId }) => {
    const test = await Test.findById(testId);
    if (!test) throw new Error(classConstant.TEST_NOT_FOUND);

    if (!test.userId.equals(userId)) throw new Error(authConstant.FORBIDDEN);

    return test.questions;
  },
  removeQuestion: async ({ testId, questionId, userId }) => {
    const test = await Test.findById(testId);
    if (!test) throw new Error(classConstant.TEST_NOT_FOUND);

    const question = test.questions.find((q) => q._id.equals(questionId));
    if (!question) throw new Error(classConstant.QUESTION_NOT_FOUND);

    test.questions = test.questions.filter((q) => !q._id.equals(questionId));

    await test.save();

    return true;
  },
  updateTest: async ({
    testId,
    userId,
    title,
    description,
    limitTimesDoTest,
    time,
    endAt,
    isActive,
  }) => {
    const test = await Test.findById(testId).populate({
      path: "userId",
      select: "_id fullName email dob gender role picture",
    });
    if (!test) throw new Error(classConstant.TEST_NOT_FOUND);

    if (!test.userId.equals(userId)) throw new Error(authConstant.FORBIDDEN);

    if (title) test.title = title;
    if (description) test.description = description;
    if (limitTimesDoTest) test.limitTimesDoTest = limitTimesDoTest;
    if (time) test.time = time;
    if (endAt) test.endAt = endAt;
    if (isActive !== null && isActive !== undefined) test.isActive = isActive;

    await test.save();

    const json = test.toJSON();

    json["user"] = json.userId;
    json["numberOfQuestion"] = json.questions.length;
    delete json.userId;
    delete json.questions;

    return json;
  },
  getTestToDo: async ({ testId, userId }) => {
    const test = await Test.findById(testId);
    if (!test) throw new Error(classConstant.TEST_NOT_FOUND);

    const klass = await Klass.findById(test.classId);
    if (!klass) throw new Error(classConstant.TEST_NOT_FOUND);

    const member = klass.members.find((mem) => mem.userId.equals(userId));
    if (!(member && member.canDoTest)) throw new Error(authConstant.FORBIDDEN);

    const testsHistory = await TestHistory.find({ userId, testId: test?.id });
    if (test.limitTimesDoTest <= testsHistory.length)
      throw new Error(classConstant.LIMIT_TIME_DO_TEST);

    const jsonTest = test.toJSON();

    jsonTest.questions.forEach((question) => {
      question.answers = question.answers.map((answer) => {
        const { isCorrect, ...rest } = answer;

        return rest;
      });
    });

    return jsonTest;
  },
  submitTest: async ({ userId, testId, userChoices, doTime }) => {
    const test = await Test.findById(testId);
    if (!test) throw new Error(classConstant.TEST_NOT_FOUND);

    const history = new TestHistory({
      title: test.title,
      description: test.description,
      userId,
      testId: test.id,
      classId: test.classId,
      time: test.time,
      doTime,
    });

    const questionsHistory = test.questions.map((question) => ({
      content: question.content,
      picture: question.picture,
      type: question.type,
      answers: question.answers
        .filter((answer) => answer._id)
        .map((answer) => {
          console.log(
            userChoices
              .find((choice) => choice.questionId === question.id)
              .choices.includes(answer._id.toString())
          );
          return {
            content: answer.content,
            picture: answer.picture,
            isCorrect: answer.isCorrect,
            isSelected: userChoices
              .find((choice) => choice.questionId === question.id)
              .choices.includes(answer._id.toString()),
          };
        }),
    }));

    history.questions = questionsHistory;

    await history.save();

    return history;
  },
  getTestHistory: async ({ testId, userId }) => {
    const test = await Test.findById(testId);
    if (!test) throw new Error(classConstant.TEST_NOT_FOUND);

    if (!test.userId.equals(userId)) throw new Error(authConstant.FORBIDDEN);

  },
};
