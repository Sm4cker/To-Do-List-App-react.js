// src/AddTask.js
import React, { useState } from "react";
import { db, auth } from "./firebaseConfig";
import { collection, addDoc } from "firebase/firestore";

function AddTask() {
  const [taskTitle, setTaskTitle] = useState("");

  const handleAddTask = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (user && taskTitle.trim()) {
      try {
        await addDoc(collection(db, "tasks", user.uid, "userTasks"), {
          title: taskTitle,
          completed: false,
        });
        setTaskTitle(""); // Clear input after adding
      } catch (error) {
        console.error("Error adding task:", error);
      }
    }
  };

  return (
    <div className="mb-4">
      <form onSubmit={handleAddTask} className="flex items-center">
        <input
          type="text"
          placeholder="Add a new task"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          required
          className="flex-grow mr-1 p-3 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="p-3 bg-blue-600 text-white rounded-r hover:bg-blue-700 transition duration-200"
        >
          Add Task
        </button>
      </form>
    </div>
  );
}

export default AddTask;