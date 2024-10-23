import { connectDB } from "@/lib/connectDB";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export const PUT = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  try {
    const { id } = params;
    const task = await request.json();
    const db = await connectDB();
    const filter = { _id: new ObjectId(id) };
    const tasklistCollection = db.collection("tasklist");
    const taskQuery = await tasklistCollection?.findOne(filter);
    if (!taskQuery) {
      return NextResponse.json({ message: "No Task Found", updated: false });
    }
    const updateDoc = {
      $set: {
        ...task,
        dueDate: task?.dueDate || taskQuery?.dueDate,
      },
    };
    const result = await tasklistCollection?.updateOne(filter, updateDoc);
    if (result?.modifiedCount === 0) {
      return NextResponse.json({ message: "Change predefined field to update", updated: false });
    }
    return NextResponse.json({ message: "Updated", updated: true });
  } catch (error) {
    console.error("Error in POST request:", error);
    return NextResponse.json(
      { message: "Something Went Wrong" },
      { status: 500 }
    );
  }
};
