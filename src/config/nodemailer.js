import nodemailer from 'nodemailer';

export const transporter = nodemailer.createTransport({
    service: 'Gmail',
    secure: true,
    auth: {
      user: "quizroom02@gmail.com",
      pass: "zgcp blht hrya uelq",
    },
  });