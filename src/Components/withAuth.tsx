"use client";
import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import Loading from "@/Components/Loading";

export const withAuth = (Component: React.ComponentType) => {
  return function AuthenticatedComponent(props: any) {
    const { status } = useSession();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
      if (
        status === "unauthenticated" &&
        pathname !== "/login" &&
        pathname !== "/register"
      ) {
        router.push("/login");
      }
    }, [status, pathname, router]);

    if (status === "loading") {
      return <Loading />;
    }

    return <Component {...props} />;
  };
};
