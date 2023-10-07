// ** mongoose
import mongoose from "mongoose";

// ** Seed function
import { seedUser } from './user.seed.js';

const seedData = async () => {
  const uri = "mongodb://127.0.0.1:27017/quizroom";

  await mongoose.connect(uri);
  console.log("Start seeding data...");

  Promise.all([seedUser()])
    .then((resp) => {
      console.log("Data generate successfull");
    })
    .catch((err) => {
      console.log(err?.message);
    })
    .finally(() => {
      mongoose.connection.close();
    });
};

seedData();
