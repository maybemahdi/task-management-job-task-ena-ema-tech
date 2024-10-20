import { connectDB } from "@/lib/connectDB";
import { NextResponse } from "next/server";

interface NewUser {
  email: string;
  password: string;
  name: string;
}

export const POST = async (request: Request) => {
  try {
    const newUser: NewUser = await request.json();
    const db = await connectDB();
    const userCollection = db.collection("users");

    // console.log(newUser);

    const isExist = await userCollection.findOne({
      email: newUser.email,
      provider: "credential",
    });

    if (isExist) {
      return NextResponse.json({ message: "User Exists" }, { status: 409 });
    }

    await userCollection.insertOne(newUser);
    return NextResponse.json(
      { message: "User Created", created: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in POST request:", error);
    return NextResponse.json(
      { message: "Something Went Wrong" },
      { status: 500 }
    );
  }
};
