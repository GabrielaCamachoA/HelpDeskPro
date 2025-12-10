import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/models/user";
import { connectDB } from "@/libs/mongodb";


export async function POST(req: Request) {
  await connectDB();

  const { email, password } = await req.json();

  const user = await User.findOne({ email }).select('+password');
  if (!user)
    return NextResponse.json({ message: "Usuario no encontrado" }, { status: 404 });

  const match = await bcrypt.compare(password, user.password);
  if (!match)
    return NextResponse.json({ message: "Contraseña incorrecta" }, { status: 400 });

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET!,
    { expiresIn: "7d" }
  );

  return NextResponse.json({
    user: {
      id: user._id,
      fullname: user.fullname,
      email: user.email,
      role: user.role,
    },
    token,
  });
}
