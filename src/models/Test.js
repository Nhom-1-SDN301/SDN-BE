import mongoose, { Schema } from "mongoose";

const { String, ObjectId, Boolean } = Schema.Types;

const Test = mongoose.model(
  "Test",
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
      subject: {
        type: String,
        require: true,
      },
      limitTimesDoTest: {
        type: Number,
        default: 1,
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
                default: null,
              },
              isCorrect: {
                type: Boolean,
                default: false,
              },
            },
          ],
        },
      ],
      userId: { type: ObjectId, ref: "User" },
      classId: { type: ObjectId, ref: "Class" },
      time: { type: Number, require: true },
      startAt: { type: Number, require: true },
      endAt: { type: Number, require: true },
      isActive: {
        type: Boolean,
        default: false,
      },
      isDelete: {
        type: Boolean,
        default: false,
      },
    },
    { timestamps: true }
  )
);

export default Test;
