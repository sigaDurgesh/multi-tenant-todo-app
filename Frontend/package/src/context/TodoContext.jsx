// src/context/TodosContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthContext } from "./AuthContext";

export const TodosContext = createContext();

export const TodosProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);

  const API_URL = "http://localhost:5000/api/todos"; // your backend URL 

  const fetchTodos = async () => {
    if (!user?.token) return; // Skip if no logged-in user

    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (!res.ok) {
        console.error("Fetch todos failed:", res.status);
        return;
      }

      const data = await res.json();
      setTodos(Array.isArray(data) ? data : []); // ensure todos is always an array
    } catch (err) {
      console.error("Error fetching todos:", err);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (todo) => {
    if (!user?.token) return;

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(todo),
      });

      const data = await res.json();
      if (res.ok && data.todo) {
        setTodos((prev) => [...(prev || []), data.todo]);
      } else {
        console.error("Add todo failed:", data);
      }
    } catch (err) {
      console.error("Error adding todo:", err);
    }
  };

  const updateTodo = async (id, updated) => {
    if (!user?.token) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(updated),
      });
      const data = await res.json();
      if (res.ok && data.todo) {
        setTodos((prev) => prev.map((t) => (t.id === id ? data.todo : t)));
      } else {
        console.error("Update todo failed:", data);
      }
    } catch (err) {
      console.error("Error updating todo:", err);
    }
  };

  // Delete todo
  const deleteTodo = async (id) => {
    if (!user?.token || !id) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setTodos((prev) => prev.filter((t) => t.id !== id));
      } else {
        console.error("Delete todo failed:", data);
      }
    } catch (err) {
      console.error("Error deleting todo:", err);
    }
  };

  // Fetch todos continuously but only after login
  useEffect(() => {
    if (!user?.token) {
      setTodos([]); // reset todos when user logs out
      return;
    }
    fetchTodos();
  }, [user]);

  return (
    <TodosContext.Provider
      value={{
        todos,
        loading,
        fetchTodos,
        addTodo,
        updateTodo,
        deleteTodo,
      }}
    >
      {children}
    </TodosContext.Provider>
  );
};
