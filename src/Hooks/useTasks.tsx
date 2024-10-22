"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";

const useTasks = () => {
  const { data: session } = useSession();
  const {
    data: tasks,
    isLoading,
    refetch,
  } = useQuery({
      queryKey: ["tasks", session?.user],
      enabled: !!session?.user,
    queryFn: async () => {
        const { data } = await axios.get(`/api/tasks/${session?.user?.email}`);
        return data;
    },
  });
    return {tasks, isLoading, refetch}
};

export default useTasks;
