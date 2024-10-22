/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
"use client";
import useTasks from "@/Hooks/useTasks";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaRegEdit, FaTrash } from "react-icons/fa";
import { TiArrowSortedDown } from "react-icons/ti";
import { SkewLoader } from "react-spinners";

interface Task {
  taskName: string;
  priority: string;
  tags: string[];
  dueDate: Date;
}

export default function Home() {
  const { status, data: session } = useSession();
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");
  const [tags, setTags] = useState<string[]>([]); // State for managing tags
  const [inputTag, setInputTag] = useState<string>("");
  const { tasks, isLoading, refetch } = useTasks();

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
    };
    try {
      const { data } = await axios.post("/api/tasks", {
        ...task,
        userName: session?.user?.name,
        userEmail: session?.user?.email,
      });
      if (data?.added) {
        refetch();
        setError("");
        setTags([]);
        form.reset();
        toast.success("Task Added to do list");
      }
    } catch (error) {
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

  return (
    <div className="my-8 px-[10px] flex gap-8 justify-between flex-col md:flex-row w-full">
      <div className="w-full flex flex-col items-center justify-center md:basis-1/2 shadow-md bg-white p-6 rounded-md">
        <h3 className="text-main font-bold text-lg">Create a Task</h3>
        <form
          onSubmit={handleSubmit}
          className="w-full mx-auto rounded px-0 md:px-8 pt-6 mb-4"
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

          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 w-full hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-all duration-300"
              type="submit"
            >
              Create Task
            </button>
          </div>
        </form>
      </div>
      <div
        className={`w-full flex flex-col items-center
          ${tasks?.length < 1 && "justify-center"}
          ${isLoading && "justify-center"}
          md:basis-1/2 shadow-md bg-white p-4 rounded-md`}
      >
        {isLoading && <SkewLoader color="#3B82F6" />}
        {!isLoading && tasks && tasks?.length > 0 && (
          <div className="mt-10 px-4 w-full">
            <h3 className="text-lg font-bold mb-4">Task List</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white shadow-md rounded-lg">
                <thead>
                  <tr className="bg-gray-200 text-gray-600 text-sm leading-normal">
                    <th className="py-3 px-6 text-left">Task Name</th>
                    <th className="py-3 px-6 text-left">Due Date</th>
                    <th className="py-3 px-6 text-left">Priority</th>
                    <th className="py-3 px-6 text-left">Tags</th>
                    <th className="py-3 px-6 text-left">Edit</th>
                    <th className="py-3 px-6 text-left">Delete</th>
                  </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                  {tasks.map((task: Task, index: number) => (
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
                            task.priority === "High"
                              ? "bg-red-200 text-red-700"
                              : task.priority === "Medium"
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
                        <FaRegEdit className="text-black cursor-pointer" size={20} />
                      </td>
                      <td className="py-3 px-6 text-left">
                        <FaTrash className="text-rose-500 cursor-pointer" size={20} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {!isLoading && tasks && tasks?.length < 1 && (
          <h3 className="text-main font-bold text-xl text-center">
            No task added yet!
          </h3>
        )}
      </div>
    </div>
  );
}
