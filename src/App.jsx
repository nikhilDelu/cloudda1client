import React, { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Trash2, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const apiUrl = import.meta.env.VITE_API_URL;
export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await axios.get(`${apiUrl}/todos`);
        setTodos(res.data);
      } catch (err) {
        console.error("Error fetching todos:", err);
      }
    };

    fetchTodos();
  }, []);

  const addTodo = async () => {
    if (!input.trim()) return;
    const newTodo = { text: input.trim() };
    try {
      const res = await axios.post(`${apiUrl}/todos`, newTodo);
      setTodos((prevTodos) => [...prevTodos, res.data]);
      setInput("");
    } catch (err) {
      console.error("Error adding todo:", err);
    }
  };

  const toggleTodo = async (id, completed) => {
    try {
      const res = await axios.patch(`${apiUrl}/todos/${id}`, {
        completed: !completed,
      });
      setTodos((prevTodos) =>
        prevTodos.map((todo) => (todo._id === id ? res.data : todo))
      );
    } catch (err) {
      console.error("Error toggling todo:", err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${apiUrl}/todos/${id}`);
      setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== id));
    } catch (err) {
      console.error("Error deleting todo:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-12 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-blue-500 p-6">
          <h1 className="text-3xl font-bold text-white">Todo List</h1>
        </div>
        <div className="p-6">
          <div className="flex mb-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Add a new task"
              className="flex-grow px-4 py-2 text-gray-700 bg-gray-200 rounded-l-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={addTodo}
              className="bg-blue-500 text-white px-6 rounded-r-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <Plus size={24} />
            </button>
          </div>
          <AnimatePresence>
            {todos.map((todo) => (
              <motion.div
                key={todo._id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -300 }}
                className="group flex items-center justify-between bg-gray-50 p-4 rounded-xl mb-2 shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => toggleTodo(todo._id, todo.completed)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      todo.completed
                        ? "bg-green-500 border-green-500"
                        : "border-gray-300"
                    }`}
                  >
                    {todo.completed && <Check size={16} color="white" />}
                  </button>
                  <span
                    className={`${
                      todo.completed
                        ? "line-through text-gray-500"
                        : "text-gray-700"
                    }`}
                  >
                    {todo.text}
                  </span>
                </div>
                <button
                  onClick={() => deleteTodo(todo._id)}
                  className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                >
                  <Trash2 size={20} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
