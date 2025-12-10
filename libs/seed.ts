import bcrypt from "bcryptjs";
import User from "@/models/user";
import { connectDB } from "@/libs/mongodb";

export async function seedDefaultAgent() {
  await connectDB();

  const existingAgent = await User.findOne({ email: "agent@default.com" });
  if (existingAgent) {
    console.log("Default agent already exists");
    return;
  }

  const hashedPassword = await bcrypt.hash("password123", 12);

  const agent = new User({
    email: "agent@default.com",
    password: hashedPassword,
    fullname: "Default Agent",
    role: "agent"
  });

  await agent.save();
  console.log("Default agent created");
}
