import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

console.log("URI =", process.env.MONGO_URI);

try {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("✅ MongoDB Connected Successfully");
  process.exit(0);
} catch (err) {
  console.log(err);
}
