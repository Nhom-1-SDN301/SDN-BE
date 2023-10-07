import mongoose, { Schema } from "mongoose";

const { String, ObjectId } = Schema.Types;

const Term = mongoose.model(
  "Term",
  new Schema(
    {
      name: {
        type: String,
        required: true,
      },
      definition: {
        type: String,
        required: true,
      },
      picture: {
        type: String,
        default: null,
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

export default Term;
