import React, { useState, useEffect } from "react";
import { db, auth } from "./firebaseConfig";
import { collection, query, onSnapshot, doc, deleteDoc, updateDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import EditTask from "./EditTask";
import { FaEdit, FaTrash } from "react-icons/fa";

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const q = query(collection(db, "tasks", user.uid, "userTasks"));

      const unsubscribe = onSnapshot(q, (snapshot) => {
        let tasksArray = [];
        snapshot.forEach((doc) => {
          tasksArray.push({ id: doc.id, ...doc.data() });
        });
        setTasks(tasksArray);
      });

      return () => unsubscribe();
    } else {
      navigate("/login");
    }
  }, [navigate]);

  const handleDeleteTask = async (taskId) => {
    const user = auth.currentUser;
    if (user) {
      try {
        await deleteDoc(doc(db, "tasks", user.uid, "userTasks", taskId));
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    }
  };

  const handleToggleCompletion = async (task) => {
    const user = auth.currentUser;
    if (user) {
      try {
        const taskDoc = doc(db, "tasks", user.uid, "userTasks", task.id);
        await updateDoc(taskDoc, {
          completed: !task.completed,
        });
      } catch (error) {
        console.error("Error updating task:", error);
      }
    }
  };

  const handleEditClick = (task) => {
    if (editingTaskId === task.id) {
      setEditingTaskId(null); // Close if already editing
    } else {
      setEditingTaskId(task.id); // Open edit for this task
    }
  };

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4">My Tasks</h2>
      <ul className="space-y-2">
        {tasks.map((task) => (
          <React.Fragment key={task.id}>
            <li className="flex justify-between items-center p-4 bg-white rounded shadow-md hover:shadow-lg transition duration-200">
              <span 
                className={`${task.completed ? 'line-through text-gray-500' : 'text-gray-800'} cursor-pointer`} 
                onClick={() => handleToggleCompletion(task)}
              >
                {task.title}
              </span>
              <div className="flex space-x-2">
                <FaEdit 
                  className="text-blue-500 hover:text-blue-700 cursor-pointer" 
                  onClick={() => handleEditClick(task)} 
                />
                <FaTrash 
                  className="text-red-500 hover:text-red-700 cursor-pointer" 
                  onClick={() => handleDeleteTask(task.id)} 
                />
              </div>
            </li>
            {editingTaskId === task.id && (
              <EditTask task={task} onClose={() => setEditingTaskId(null)} />
            )}
          </React.Fragment>
        ))}
      </ul>
    </div>
  );
}

export default TaskList;
