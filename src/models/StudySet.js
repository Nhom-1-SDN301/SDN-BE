import mongoose, { Schema } from "mongoose";

const { String, Number, Boolean, ObjectId } = Schema.Types;

const StudySet = mongoose.model(
  "StudySet",
  new Schema(
    {
      title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
        default: null,
      },
      canVisit: {
        type: Number,
        enum: [1, 2, 3],
        default: 1,
      },
      visitPassword: {
        type: String,
        default: null,
      },
      isDelete: {
        type: Boolean,
        default: false,
      },
      userId: {
        type: ObjectId,
        ref: "User",
      },
      shareTo: [{ type: ObjectId, ref: "User" }],
    },
    { timestamps: true }
  )
);

export default StudySet;
