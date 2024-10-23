import { connectDB } from "@/lib/connectDB";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export const PATCH = async (
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
  const updateDoc = {
    $set: {
      reminder: !task?.reminder,
    },
  };
  const result = await tasklistCollection.updateOne(filter, updateDoc);
   if (result.modifiedCount === 0) {
     return NextResponse.json({ message: "Not Updated", updated: false });
   }

  return NextResponse.json({ message: "Updated", updated: true });
};
