import mongoose, { Schema } from "mongoose";

const { Number, String, ObjectId } = Schema.Types;

const StudySetRate = mongoose.model(
  "StudySetRate",
  new Schema(
    {
      star: {
        type: Number,
        enum: [1, 2, 3, 4, 5],
        required: true,
      },
      comment: {
        type: String,
        default: null,
      },
      userId: {
        type: ObjectId,
        ref: "User",
        required: true,
      },
      studySetId: {
        type: ObjectId,
        ref: "StudySet",
        required: true,
      },
    },
    { timestamps: true }
  )
);

export default StudySetRate;
