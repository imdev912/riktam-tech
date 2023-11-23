import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
  try {
    const conn = await mongoose
    .connect(process.env.MONGO_URI!);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error: ${error.message}`);
    }

    process.exit(1);
  }
};

export const disconnectBD = async () => {
  await mongoose.disconnect();
};