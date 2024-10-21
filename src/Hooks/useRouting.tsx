"use client";
import { useRouter } from "next/navigation";

const useRouting = () => {
  const router = useRouter();

  const goRoute = (path: string) => {
    router.push(`${path}`);
  };

  return goRoute;
};

export default useRouting;
