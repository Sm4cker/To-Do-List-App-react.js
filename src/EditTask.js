import React, { useState } from "react";
import { db, auth } from "./firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";

function EditTask({ task, onClose }) {
  const [newTitle, setNewTitle] = useState(task.title);

  const handleEditTask = async (e) => {
    e.preventDefault();
    const user = auth.currentUser;
    if (user && newTitle.trim()) {
      try {
        const taskDoc = doc(db, "tasks", user.uid, "userTasks", task.id);
        await updateDoc(taskDoc, {
          title: newTitle,
        });
        onClose(); // Close the edit form after updating
      } catch (error) {
        console.error("Error editing task:", error);
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow-md">
      <h3 className="text-xl font-bold mb-4">Edit Task</h3>
      <form onSubmit={handleEditTask} className="flex items-center">
        <input
          type="text"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          required
          className="flex-grow p-3 border border-gray-300 rounded-l focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="p-3 bg-blue-600 text-white rounded-r hover:bg-blue-700 transition duration-200"
        >
          Update Task
        </button>
        <button
          type="button"
          onClick={onClose}
          className="ml-2 p-3 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition duration-200"
        >
          Cancel
        </button>
      </form>
    </div>
  );
}

export default EditTask;
