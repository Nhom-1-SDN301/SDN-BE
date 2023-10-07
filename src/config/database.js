import mongoose from 'mongoose';

export const connection = async () => {
    const url = process.env.DATABASE_URI

    await mongoose.connect(url);

    const state = Number(mongoose.connection.readyState);
    console.log(state === 1 ? "Connected to mongodb" : "Failed to connect");
}
