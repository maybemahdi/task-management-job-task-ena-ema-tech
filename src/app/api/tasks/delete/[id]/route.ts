import { connectDB } from "@/lib/connectDB";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export const DELETE = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
    const { id } = params;
    const db = await connectDB();
    const tasklistCollection = db.collection("tasklist");
    const filter = { _id: new ObjectId(id) };
    const task = await tasklistCollection.findOne(filter);
    if (!task) {
      return NextResponse.json({ message: "Task not found", updated: false });
    }
    const result = await tasklistCollection.deleteOne(filter);
    if (result.deletedCount === 0) {
      return NextResponse.json({ message: "Not Deleted", deleted: false });
    }

    return NextResponse.json({ message: "Deleted", deleted: true });
};
