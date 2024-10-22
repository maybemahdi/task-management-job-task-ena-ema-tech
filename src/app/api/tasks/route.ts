import { connectDB } from "@/lib/connectDB";
import { NextResponse } from "next/server";

export const POST = async (request: Request) => {
  try {
    const task = await request.json();
    const db = await connectDB();
    const tasklistCollection = db.collection("tasklist");
    await tasklistCollection.insertOne({
      ...task,
      createdAt: new Date().toISOString(),
    });
    return NextResponse.json(
      { message: "Task Added", added: true },
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