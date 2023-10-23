import mongoose from "mongoose";

const { String, Date, Number, Boolean, ObjectId } = mongoose.Schema.Types;

const User = mongoose.model(
  "User",
  new mongoose.Schema(
    {
      fullName: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
        unique: true,
      },
      picture: {
        type: String,
        default: null,
      },
      password: {
        type: String,
        default: "123456",
      },
      dob: {
        type: Date,
        default: null,
      },
      gender: {
        type: Number,
        default: 1,
      },
      phone: {
        type: String,
        default: null,
      },
      address: {
        type: String,
        default: null,
      },
      refreshToken: {
        type: String,
        default: null,
      },
      provider: {
        type: String,
        default: "Quizroom",
      },
      role: {
        type: {
          id: Number,
          name: String,
        },
        default: {
          id: 3,
          name: "member",
        },
      },
      isDelete: {
        type: Boolean,
        default: false,
      },
    },
    { timestamps: true }
  )
);

export default User;
