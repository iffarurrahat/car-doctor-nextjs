import { connectDB } from "@/lib/connectDB";
const bcrypt = require("bcrypt");

export const POST = async (request) => {
  const newUser = await request.json();
  console.log("newUser", newUser);

  try {
    const db = await connectDB();
    const userCollection = db.collection("users");
    const exits = await userCollection.findOne({ email: newUser.email });
    if (exits) {
      return Response.json({ message: "User Exists" }, { status: 304 });
    }
    const hashPassword = bcrypt.hashSync(newUser.password, 14);
    const resp = await userCollection.insertOne({
      ...newUser,
      password: hashPassword,
    });
    return Response.json({ message: "User Created" }, { status: 200 });
  } catch (error) {
    return Response.json({ message: "Something went wrong" }, { status: 500 });
  }
};