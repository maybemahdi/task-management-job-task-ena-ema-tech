import { connectDB } from "@/lib/connectDB";
import { NextResponse } from "next/server";

export const GET = async (
  request: Request,
  { params }: { params: { email: string } }
) => {
  const { email } = params;
  const db = await connectDB();
  const tasklistCollection = db.collection("tasklist");
  const url = new URL(request.url);
  const search = url.searchParams.get("search") || "";
  let query: { [key: string]: any } = {
    userEmail: email, // Ensure the userEmail filter is included
  };
  if (search) {
    query = {
      ...query,
      $or: [
        { taskName: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ],
    };
  }
  const result = await tasklistCollection.find(query).toArray();
  if (!result) {
    return NextResponse.json({ message: "No task found" });
  }

  return NextResponse.json(result);
};
