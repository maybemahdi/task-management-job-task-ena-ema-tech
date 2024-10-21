"use client"
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";

export default function Home() {
  const { status } = useSession();
  useEffect(() => {
    document.title = "Task Manager | Home";
  }, [status]);
  return (
    <div>
      <h3 className="text-rose-500">Hello World</h3>
    </div>
  );
}
