/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaRegEdit, FaTrash } from "react-icons/fa";
import { ImSpinner9 } from "react-icons/im";
import { IoIosCheckmarkCircle } from "react-icons/io";
import { TiArrowSortedDown } from "react-icons/ti";
import { SkewLoader } from "react-spinners";

interface Task {
  _id: string;
  taskName: string;
  priority: string;
  tags: string[];
  dueDate: Date;
  status: string;
}

export default function Home() {
  const { status, data: session } = useSession();
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");
  const [tags, setTags] = useState<string[]>([]); // State for managing tags
  const [inputTag, setInputTag] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  //filtering
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("");
  const [submittedSearch, setSubmittedSearch] = useState("");

  useEffect(() => {
    document.title = "Task Manager | Home";
  }, [status]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const currentDate = new Date();
    const selectedDate = new Date(dueDate);

    // Check if due date is in the future
    if (selectedDate <= currentDate) {
      setError("Due date must be in the future.");
      toast.error("Due date must be in the future.");
      return;
    }

    if (tags?.length < 1) {
      toast.error("Select a tag at least");
      return;
    }

    const form = e.target as HTMLFormElement;
    const taskName = form?.taskName?.value;
    const description = form?.description?.value;
    const priority = form?.priority?.value;

    const task = {
      taskName,
      description,
      dueDate: selectedDate,
      priority,
      tags,
      status: "Pending",
    };
    try {
      setIsProcessing(true);
      const { data } = await axios.post("/api/tasks", {
        ...task,
        userName: session?.user?.name,
        userEmail: session?.user?.email,
      });
      if (data?.added) {
        setIsProcessing(false);
        refetch();
        setError("");
        setTags([]);
        form.reset();
        setDueDate("");
        toast.success("Task Added to do list");
      }
    } catch (error) {
      setIsProcessing(false);
      console.log(error);
    }
  };

  // Add tag from input
  const addTag = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (inputTag && !tags.includes(inputTag)) {
      setTags([...tags, inputTag]);
      setInputTag("");
      setInputTag("");
    }
  };

  // Remove tag
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag: string) => tag !== tagToRemove));
  };

  // Handle adding a tag from predefined categories
  const addPredefinedTag = (tag: string) => {
    if (!tags.includes(tag)) {
      setTags([...tags, tag]);
    }
  };

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const searchInput = form?.search?.value;
    setSubmittedSearch(searchInput);
  };

  const {
    data: tasks,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: [
      "tasks",
      session?.user,
      submittedSearch,
      statusFilter,
      priorityFilter,
    ],
    enabled: !!session?.user,
    queryFn: async () => {
      const { data } = await axios.get(
        `/api/tasks/${session?.user?.email}?search=${submittedSearch}&status=${statusFilter}&priority=${priorityFilter}`
      );
      return data;
    },
  });

  const handleMarkAsCompleted = async (id: string) => {
    try {
      setIsUpdating(true);
      const { data } = await axios.patch(`/api/tasks/status/${id}`);
      if (data?.updated) {
        setIsUpdating(false);
        refetch();
        toast.success("Marked as Completed");
      } else {
        setIsUpdating(false);
        toast.error("Please reload and try again");
      }
    } catch (error: any) {
      setIsUpdating(false);
      console.log(error);
      toast.error(error?.message);
    }
  };

  return (
    <div className="my-8 px-[10px] flex gap-5 justify-between flex-col md:flex-row w-full">
      <div className="w-full flex flex-col items-center justify-center md:basis-[30%] shadow-md bg-white p-6 rounded-md">
        <h3 className="text-main font-bold text-lg">Create a Task</h3>
        <form
          onSubmit={handleSubmit}
          className="w-full mx-auto rounded pt-6 mb-4"
        >
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="taskName"
            >
              Task Name
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="text"
              id="taskName"
              name="taskName"
              placeholder="Enter task name"
              required
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="description"
              name="description"
              placeholder="Enter task description"
              required
            ></textarea>
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="dueDate"
            >
              Due Date
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              type="date"
              id="dueDate"
              name="dueDate"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>

          <div className="mb-4 relative">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="priority"
            >
              Priority
            </label>
            <select
              className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded leading-tight focus:outline-none focus:border-blue-500"
              id="priority"
              name="priority"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 top-1/2 flex items-center px-2 text-gray-700">
              {/* Custom arrow icon */}
              <TiArrowSortedDown size={20} className="text-main" />
            </div>
          </div>

          <div className="mb-2">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="tags"
            >
              Category Tags
            </label>
            <div className="flex items-center mb-2">
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="text"
                id="tags"
                name="tags"
                placeholder="Add custom category tag and press enter"
                value={inputTag}
                onChange={(e) => setInputTag(e.target.value)}
              />
              <button
                className="ml-2 bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded transition-all duration-300"
                onClick={addTag}
              >
                Add
              </button>
            </div>
            <div className="flex gap-2 flex-wrap">
              {tags.map((tag: string) => (
                <span
                  key={tag}
                  className="bg-blue-500 text-white text-sm font-medium py-1 px-2 rounded-full flex items-center"
                >
                  {tag}
                  <button
                    className="ml-2 text-white bg-red-500 rounded-full px-2"
                    onClick={() => removeTag(tag)}
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <div className="flex gap-2 flex-wrap">
              <button
                type="button"
                className="bg-blue-500 text-white text-sm font-medium py-1 px-2 rounded-full"
                onClick={() => addPredefinedTag("Work")}
              >
                Work
              </button>
              <button
                type="button"
                className="bg-green-500 text-white text-sm font-medium py-1 px-2 rounded-full"
                onClick={() => addPredefinedTag("Personal")}
              >
                Personal
              </button>
              <button
                type="button"
                className="bg-purple-500 text-white text-sm font-medium py-1 px-2 rounded-full"
                onClick={() => addPredefinedTag("Shopping")}
              >
                Shopping
              </button>
            </div>
          </div>

          <div className="flex justify-center items-center">
            <button
              className="flex justify-center items-center bg-blue-500 text-center w-full hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-all duration-300"
              type="submit"
            >
              {!isProcessing ? (
                "Create Task"
              ) : (
                <ImSpinner9 className="animate-spin" size={20} />
              )}
            </button>
          </div>
        </form>
      </div>
      <div
        className={`w-full flex flex-col items-center
          ${isLoading && "justify-center"}
          md:flex-1 shadow-md bg-white p-4 rounded-md overflow-x-auto`}
      >
        {isLoading || (isUpdating && <SkewLoader color="#3B82F6" />)}
        {!isLoading && tasks && (
          <div className="mt-10 px-4 w-full">
            <h3 className="text-lg font-bold mb-4">Task List</h3>
            <div className="flex flex-col gap-3 justify-start md:flex-row md:justify-between md:*:items-center mb-4">
              <div>
                <form onSubmit={handleSearch} className="w-full relative">
                  <input
                    type="text"
                    name="search"
                    placeholder="Search..."
                    className="border border-[#e5eaf2] py-2 pl-4 pr-[65px] outline-none w-full rounded-md"
                  />

                  <button
                    type="submit"
                    className="bg-gray-300 text-gray-500 absolute top-0 right-0 h-full px-5 flex items-center justify-center rounded-r-md cursor-pointer hover:bg-gray-400 hover:text-gray-200"
                  >
                    Search
                  </button>
                </form>
              </div>
              <div className="flex flex-col md:flex-row justify-start md:items-center md:justify-center gap-3">
                <div className="relative">
                  <select
                    className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                  >
                    <option disabled value="">
                      Sort by Status
                    </option>
                    <option value="All">All</option>
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                  </select>
                </div>
                <div className="relative">
                  <select
                    className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    value={priorityFilter}
                    onChange={(e) => setPriorityFilter(e.target.value)}
                  >
                    <option disabled value="">
                      Sort by Priority
                    </option>
                    <option value="all">All</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <button
                  onClick={() => {
                    setPriorityFilter("");
                    setStatusFilter("");
                    setSubmittedSearch("");
                  }}
                  className="bg-main p-2 rounded text-white hover:bg-blue-600 transition-all duration-300"
                >
                  Reset
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white shadow-md rounded-lg">
                <thead>
                  <tr className="bg-gray-200 text-gray-600 text-sm leading-normal">
                    <th className="py-3 px-6 text-left">Task Name</th>
                    <th className="py-3 px-6 text-left">Due Date</th>
                    <th className="py-3 px-6 text-left">Priority</th>
                    <th className="py-3 px-6 text-left">Tags</th>
                    <th className="py-3 px-6 text-left">Status</th>
                    <th className="py-3 px-6 text-left">Edit</th>
                    <th className="py-3 px-6 text-left">Delete</th>
                    <th className="py-3 px-6 text-left">Mark</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                  {tasks?.map((task: Task, index: number) => (
                    <tr
                      key={index}
                      className="border-b border-gray-200 hover:bg-gray-100"
                    >
                      <td className="py-3 px-6 text-left whitespace-nowrap">
                        <span className="font-medium">{task.taskName}</span>
                      </td>
                      <td className="py-3 px-6 text-left">
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString("en-GB", {
                              year: "numeric",
                              month: "2-digit",
                              day: "2-digit",
                            })
                          : "No due date"}
                      </td>
                      <td className="py-3 px-6 text-left">
                        <span
                          className={`py-1 px-3 rounded-full text-xs ${
                            task.priority === "high"
                              ? "bg-red-200 text-red-700"
                              : task.priority === "medium"
                              ? "bg-yellow-200 text-yellow-700"
                              : "bg-green-200 text-green-700"
                          }`}
                        >
                          {task.priority}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-left">
                        <div className="flex gap-2">
                          {task?.tags?.map((tag, idx) => (
                            <span
                              key={idx}
                              className="bg-blue-500 text-white text-xs font-medium py-1 px-2 rounded-full"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-6 text-left">
                        <span
                          className={`py-1 px-3 rounded-full text-xs ${
                            task.status === "Pending"
                              ? "bg-yellow-200 text-yellow-700"
                              : task.status === "Completed"
                              ? "bg-green-200 text-green-700"
                              : ""
                          }`}
                        >
                          {task?.status}
                        </span>
                      </td>
                      <td className="py-3 px-6 text-left">
                        <FaRegEdit
                          title="edit task"
                          className="text-black cursor-pointer"
                          size={20}
                        />
                      </td>
                      <td className="py-3 px-6 text-left">
                        <FaTrash
                          title="delete task"
                          className="text-rose-500 cursor-pointer"
                          size={20}
                        />
                      </td>
                      <td className="py-3 px-6 text-left">
                        <button
                          onClick={() => handleMarkAsCompleted(task?._id)}
                          disabled={task?.status === "Completed"}
                        >
                          <IoIosCheckmarkCircle
                            title="Mark as Completed"
                            className={`${
                              task?.status === "Completed"
                                ? "cursor-not-allowed text-gray-300"
                                : "text-green-500 cursor-pointer"
                            }`}
                            size={20}
                          />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
