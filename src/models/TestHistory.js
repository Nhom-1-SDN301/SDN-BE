import mongoose, { Schema } from "mongoose";

const { String, ObjectId, Boolean } = Schema.Types;

const TestHistory = mongoose.model(
  "TestHistory",
  new Schema(
    {
      title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        required: false,
      },
      questions: [
        {
          content: {
            type: String,
            required: true,
          },
          picture: {
            type: String,
            default: null,
          },
          type: {
            type: String,
            enum: ["single", "multiple"],
            default: "single",
          },
          answers: [
            {
              content: {
                type: String,
                required: false,
              },
              picture: {
                type: String,
                required: false,
              },
              isCorrect: {
                type: Boolean,
                default: false,
              },
              isSelected: {
                type: Boolean,
                default: false,
              },
            },
          ],
        },
      ],
      userId: { type: ObjectId, ref: "User" },
      testId: { type: ObjectId, ref: "Test" },
      classId: { type: ObjectId, ref: "Class" },
      time: { type: Number, required: true },
      doTime: { type: Number, required: true },
      isDelete: {
        type: Boolean,
        default: false,
        select: false,
      },
    },
    { timestamps: true }
  )
);

export default TestHistory;
