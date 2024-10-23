import { connectDB } from "@/lib/connectDB";
import { ObjectId } from "mongodb";
import { NextResponse } from "next/server";

export const PATCH = async (
  request: Request,
  { params }: { params: { id: string } }
) => {
  const { id } = params;
  const { isDeleted } = await request.json(); // Expect isDeleted field in request body

  const db = await connectDB();
  const tasklistCollection = db.collection("tasklist");

  const filter = { _id: new ObjectId(id) };
  const updateDoc = { $set: { isDeleted } };

  const result = await tasklistCollection.updateOne(filter, updateDoc);

  if (result.modifiedCount === 0) {
    return NextResponse.json({ message: "Not Updated", updated: false });
  }

  return NextResponse.json({ message: "Updated", updated: true });
};
