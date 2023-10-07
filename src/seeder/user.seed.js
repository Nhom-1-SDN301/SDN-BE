// ** Faker
import { faker } from "@faker-js/faker";

// ** Bcrypt
import bcrypt from "bcrypt";

// ** Model
import User from "../models/User.js";

export const seedUser = () => {
  const salt = bcrypt.genSaltSync();
  const users = [];

  // Seed 1 admin
  users.push({
    fullName: faker.person.fullName(),
    email: faker.internet.email(),
    password: bcrypt.hashSync("123456", salt),
    dob: faker.date.birthdate(),
    gender: faker.number.int({ min: 0, max: 1 }),
    phone: faker.phone.number(),
    address: faker.location.streetAddress(),
    role: {
      id: 1,
      name: "Admin",
    },
    isDelete: false,
  });

  // Seed 3 moderator
  for (let i = 0; i < 3; ++i) {
    users.push({
      fullName: faker.person.fullName(),
      email: faker.internet.email(),
      password: bcrypt.hashSync("123456", salt),
      dob: faker.date.birthdate(),
      gender: faker.number.int({ min: 0, max: 1 }),
      phone: faker.phone.number(),
      address: faker.location.streetAddress(),
      role: {
        id: 2,
        name: "Moderator",
      },
      isDelete: false,
    });
  }

  // Seed 15 member
  for (let i = 0; i < 15; ++i) {
    users.push({
      fullName: faker.person.fullName(),
      email: faker.internet.email(),
      password: bcrypt.hashSync("123456", salt),
      dob: faker.date.birthdate(),
      gender: faker.number.int({ min: 0, max: 1 }),
      phone: faker.phone.number(),
      address: faker.location.streetAddress(),
      role: {
        id: 3,
        name: "Member",
      },
      isDelete: false,
    });
  }

  return User.insertMany(users);
};
