import React from "react";
import TaskList from "./TaskList";
import AddTask from "./AddTask";
import { auth } from "./firebaseConfig";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

    const handleLogout = async () => {
        try {
          await signOut(auth);
          console.log("User logged out successfully!");
          navigate("/login"); // Redirect to login page
        } catch (error) {
          console.error("Error logging out:", error);
        }
      };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-5">
      <h2 className="text-3xl font-bold mb-6">ToDo List</h2>
      <div className="bg-white p-6 rounded shadow-md w-full max-w-2xl mb-6">
        <AddTask />
      </div>
      <div className="bg-white p-6 rounded shadow-md w-full max-w-2xl">
        <TaskList />
      </div>
      <div>
        <button 
            onClick={handleLogout} 
            className="btn-logout mt-4 p-2 bg-red-500 text-white rounded hover:bg-red-700 transition duration-200"
        >
            Logout
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
