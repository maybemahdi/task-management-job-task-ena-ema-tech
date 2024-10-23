import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";

interface ToggleButtonProps {
    task: Task;
    refetch: () => void;
}
interface Task {
  reminder: boolean;
  _id: string;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({ task, refetch }) => {
  // Initialize toggle state based on task.reminder
  const [toggle, setToggle] = useState(task?.reminder || false);

  // Handle toggle click
  const handleToggle = async (id: string) => {
    // Toggle the state
    setToggle((prevState) => !prevState);
    const { data } = await axios.patch(`/api/tasks/reminder/${id}`);
    if (data?.updated) {
        refetch();
        toast.success(`Reminder turned ${task?.reminder ? "Off" : "On"}`);
    } else {
        refetch();
        toast.error(`Reload and try again`);
    }
  };

  return (
    <td className="py-3 px-6 text-left">
      <div
        className={`${
          toggle ? "bg-[#3B9DF8]" : "bg-[#f0f0f0]"
        } w-[57px] h-[30px] px-[0.150rem] py-[0.160rem] cursor-pointer border transition-colors duration-500 border-[#e5eaf2] rounded-full relative`}
        onClick={() => handleToggle(task?._id)}
      >
        <div
          className={`${
            toggle ? "translate-x-[27px]" : "translate-x-[0px]"
          } w-[23px] h-[23px] pb-1 transition-all duration-500 rounded-full bg-[#fff]`}
          style={{
            boxShadow: "1px 2px 5px 2px rgb(0,0,0,0.1)",
          }}
        ></div>
      </div>
    </td>
  );
};

export default ToggleButton;
