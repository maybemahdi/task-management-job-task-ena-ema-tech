import { connectDB } from "@/lib/connectDB";
import { NextResponse } from "next/server";

export const GET = async (
  request: Request,
  { params }: { params: { email: string } }
) => {
  const { email } = params;
  const db = await connectDB();
  const tasklistCollection = db.collection("tasklist");
  const result = await tasklistCollection
    .find({ userEmail: email })
    .toArray();
  if (!result) {
    return NextResponse.json({ message: "No task found" });
  }

  return NextResponse.json(result);
};
