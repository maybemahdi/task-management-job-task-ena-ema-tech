import React, { FormEvent, Fragment, useState } from "react";
import "../app/globals.css";
import {
  Dialog,
  DialogPanel,
  Transition,
  TransitionChild,
} from "@headlessui/react";
import { ImSpinner9 } from "react-icons/im";
import { TiArrowSortedDown } from "react-icons/ti";
import toast from "react-hot-toast";
import axios from "axios";

interface EditTaskModalProps {
  task: Task;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  refetch: () => void;
}

interface Task {
  _id: string;
  taskName: string;
  description: string;
  priority: string;
  tags: string[];
  dueDate: Date;
  status: string;
  reminder: boolean;
}

const EditTaskModal: React.FC<EditTaskModalProps> = ({
  task,
  refetch,
  isOpen,
  setIsOpen,
}) => {
  const [dueDate, setDueDate] = useState("");
  const [error, setError] = useState("");
  const [tags, setTags] = useState<string[]>(task?.tags || []); // State for managing tags
  const [inputTag, setInputTag] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const id: string = task?._id;

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

    const taskForUpdate = {
      taskName,
      description,
      dueDate: selectedDate,
      priority,
      tags,
      status: "Pending",
      reminder: false,
    };
    try {
      setIsProcessing(true);
      const { data } = await axios.put(`/api/tasks/updateTask/${id}`, {
        ...taskForUpdate,
      });
      if (data?.updated) {
        setIsProcessing(false);
        refetch();
        setError("");
        setTags([]);
        setIsOpen(false);
        toast.success("Task Updated");
      } else {
        setIsProcessing(false);
        refetch();
        setError("");
        setDueDate("");
        toast.error(data?.message);
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
  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative w-full z-[1000]"
          onClose={() => {
            setIsOpen(false);
          }}
        >
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </TransitionChild>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <TransitionChild
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <DialogPanel className="w-full max-w-xl transform overflow-visible rounded-2xl bg-white align-middle shadow-xl transition-all relative">
                  <div className="w-full flex flex-col items-center justify-center shadow-md bg-white p-6 rounded-md">
                    <h3 className="text-main font-bold text-lg">
                      Update your Task
                    </h3>
                    <form
                      onSubmit={handleSubmit}
                      className="w-full mx-auto rounded pt-6 mb-4"
                    >
                      <div className="mb-4">
                        <label
                          className="block text-gray-700 text-sm font-bold mb-2 text-left"
                          htmlFor="taskName"
                        >
                          Task Name
                        </label>
                        <input
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          type="text"
                          id="taskName"
                          name="taskName"
                          defaultValue={task?.taskName}
                          placeholder="Enter task name"
                          required
                        />
                      </div>

                      <div className="mb-4">
                        <label
                          className="block text-gray-700 text-sm font-bold mb-2 text-left"
                          htmlFor="description"
                        >
                          Description
                        </label>
                        <textarea
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          id="description"
                          name="description"
                          placeholder="Enter task description"
                          defaultValue={task?.description}
                          required
                        ></textarea>
                      </div>

                      <div className="mb-4">
                        <label
                          className="block text-gray-700 text-sm font-bold mb-2 text-left"
                          htmlFor="dueDate"
                        >
                          Due Date{" "}
                          <span>
                            (Current Due Date is{" "}
                            {new Date(task?.dueDate).toLocaleDateString(
                              "en-GB",
                              {
                                year: "numeric",
                                month: "2-digit",
                                day: "2-digit",
                              }
                            )}
                            )
                          </span>
                        </label>
                        <input
                          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                          type="date"
                          id="dueDate"
                          name="dueDate"
                          value={dueDate}
                          onChange={(e) => setDueDate(e.target.value)}
                        />
                        {error && (
                          <p className="text-red-500 text-sm mt-2">{error}</p>
                        )}
                      </div>

                      <div className="mb-4 relative">
                        <label
                          className="block text-gray-700 text-sm font-bold mb-2 text-left"
                          htmlFor="priority"
                        >
                          Priority
                        </label>
                        <select
                          className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-3 rounded leading-tight focus:outline-none focus:border-blue-500"
                          id="priority"
                          name="priority"
                          defaultValue={task?.priority}
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
                          className="block text-gray-700 text-sm font-bold mb-2 text-left"
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
                            "Update Task"
                          ) : (
                            <ImSpinner9 className="animate-spin" size={20} />
                          )}
                        </button>
                      </div>
                    </form>
                  </div>
                </DialogPanel>
              </TransitionChild>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default EditTaskModal;
