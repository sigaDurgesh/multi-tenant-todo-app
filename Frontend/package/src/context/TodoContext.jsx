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
    if (!user) return;
    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      setTodos(data); // data should be array of todos
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const addTodo = async (todo) => {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(todo),
    });
    const data = await res.json();
    setTodos((prev) => [...prev, data.todo]); // use data.todo
  };

  const updateTodo = async (id, updated) => {
    const res = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
      body: JSON.stringify(updated),
    });
    const data = await res.json();
    setTodos((prev) => prev.map((t) => (t.id === id ? data.todo : t)));
  };

  const deleteTodo = async (id) => {
    if (!id) return console.error("deleteTodo called without id!");
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setTodos((prev) => prev.filter((t) => t.id !== id));
      } else {
        console.error(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [user]);

  return (
    <TodosContext.Provider
      value={{ todos, loading, fetchTodos, addTodo, updateTodo, deleteTodo }}
    >
      {children}
    </TodosContext.Provider>
  );
};
