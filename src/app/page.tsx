"use client";
// import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Loading from "@/Components/Loading";
import { useEffect } from "react";

export default function Home() {
  const { status } = useSession();
  const router = useRouter();

  useEffect(() => {
    document.title =
      status === "authenticated" ? "Task Manager | Home" : "";
  }, [status]);

  console.log(status);

  if (status === "loading") return <Loading />;
  if (status === "unauthenticated") {
    router.push("/login");
  }

  return (
    <div>
      <h3 className="text-rose-500">Hello World</h3>
    </div>
  );
}
